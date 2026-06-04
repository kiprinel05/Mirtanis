import { Injectable, signal } from '@angular/core';

export type PerfTier = 'low' | 'medium' | 'high';

interface CachedPerf {
  tier: PerfTier;
  fps: number;
  v: number;        // schema version — bump to invalidate old caches
  ts: number;       // when measured
}

const CACHE_KEY = 'mirtanis_perf';
const CACHE_VERSION = 3;
const CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 7; // re-benchmark weekly

/**
 * Runtime performance detection.
 *
 * On first load it measures real frame rate with requestAnimationFrame for
 * ~1.4s, then classifies the device as low / medium / high. The result is
 * cached in localStorage so the benchmark doesn't run on every refresh.
 *
 * It also factors in cheap hardware hints (deviceMemory, hardwareConcurrency,
 * saveData) and OS signals (prefers-reduced-motion), and re-checks once if the
 * device drops onto battery / power-saving so a laptop that throttles after
 * unplugging is downgraded automatically.
 *
 * Consumers read `tier()` (a signal) and the boolean helpers. Nothing here
 * depends on detecting a specific GPU/CPU model — only the experienced FPS.
 */
@Injectable({ providedIn: 'root' })
export class PerformanceService {
  /** Current tier. Starts at a safe guess, updated once the benchmark finishes. */
  readonly tier = signal<PerfTier>(this.initialGuess());
  /** True until the FPS benchmark has produced a verdict. */
  readonly measured = signal(false);

  /**
   * OS "reduce motion" preference. We expose it but DON'T treat it as an
   * all-or-nothing kill switch — the site's decorative motion stays on and
   * adaptation is driven by the measured FPS tier instead.
   */
  readonly reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;

  // ---- convenience flags used across the app --------------------------------
  isLow(): boolean { return this.tier() === 'low'; }
  isMedium(): boolean { return this.tier() === 'medium'; }
  isHigh(): boolean { return this.tier() === 'high'; }
  /** Decorative motion (petals, blobs, parallax) allowed at all? */
  allowsAmbientMotion(): boolean { return this.tier() !== 'low'; }
  /** Heavy GPU effects (backdrop-filter, big blur) allowed? */
  allowsHeavyGpu(): boolean { return this.tier() === 'high'; }

  /** How many decorative items to render for a given full-quality count. */
  scaleCount(highCount: number): number {
    switch (this.tier()) {
      case 'low': return 0;
      case 'medium': return Math.round(highCount * 0.5);
      default: return highCount;
    }
  }

  constructor() {
    if (typeof window === 'undefined') return;

    const cached = this.readCache();
    if (cached) {
      this.tier.set(cached.tier);
      this.measured.set(true);
      this.applyTierClass();
    } else {
      // Defer so we never compete with first paint / hydration.
      const start = () => this.runBenchmark();
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(start, { timeout: 1500 });
      } else {
        setTimeout(start, 600);
      }
    }

    this.watchBattery();
    this.applyTierClass();
  }

  // ---------------------------------------------------------------------------

  /** Cheap, instant heuristic used before the benchmark completes. */
  private initialGuess(): PerfTier {
    if (typeof navigator === 'undefined') return 'medium';
    const mem = (navigator as any).deviceMemory as number | undefined;       // GB, coarse
    const cores = navigator.hardwareConcurrency as number | undefined;
    const saveData = (navigator as any).connection?.saveData === true;
    if (saveData) return 'low';
    if ((mem !== undefined && mem <= 2) || (cores !== undefined && cores <= 2)) return 'low';
    if ((mem !== undefined && mem <= 4) || (cores !== undefined && cores <= 4)) return 'medium';
    return 'high';
  }

  private runBenchmark(): void {
    let frames = 0;
    let worst = Infinity;
    let last = performance.now();
    const startedAt = last;
    const DURATION = 1400;

    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      if (dt > 0) {
        frames++;
        // track the worst instantaneous fps (jank spikes hurt UX most)
        const inst = 1000 / dt;
        if (inst < worst) worst = inst;
      }
      if (now - startedAt < DURATION) {
        requestAnimationFrame(tick);
      } else {
        const elapsed = (now - startedAt) / 1000;
        const avgFps = frames / elapsed;
        this.classify(avgFps, worst);
      }
    };
    requestAnimationFrame(tick);
  }

  private classify(avgFps: number, worstFps: number): void {
    // Blend hardware hint with measured fps so a fast-but-throttling laptop
    // still lands correctly, and a weak device with a lucky idle frame doesn't
    // get over-promoted.
    let tier: PerfTier;
    if (avgFps >= 52 && worstFps >= 24) tier = 'high';
    else if (avgFps >= 38) tier = 'medium';
    else tier = 'low';

    // Never promote above the cheap hardware guess by more than one step.
    const guess = this.initialGuess();
    if (guess === 'low' && tier === 'high') tier = 'medium';

    this.tier.set(tier);
    this.measured.set(true);
    this.writeCache({ tier, fps: Math.round(avgFps), v: CACHE_VERSION, ts: Date.now() });
    this.applyTierClass();
  }

  /** Downgrade (and re-benchmark) when the laptop switches to battery. */
  private watchBattery(): void {
    const navAny = navigator as any;
    if (typeof navAny.getBattery !== 'function') return;
    navAny.getBattery().then((bat: any) => {
      const onChange = () => {
        if (!bat.charging && this.tier() === 'high') {
          // Power-saving on battery often throttles the GPU — re-measure once.
          this.clearCache();
          this.runBenchmark();
        }
      };
      bat.addEventListener?.('chargingchange', onChange);
    }).catch(() => {});
  }

  /** Mirror the tier onto <html> so CSS can react without per-element bindings. */
  private applyTierClass(): void {
    const el = document.documentElement;
    el.classList.remove('perf-low', 'perf-medium', 'perf-high');
    el.classList.add(`perf-${this.tier()}`);
  }

  // ---- cache ----------------------------------------------------------------
  private readCache(): CachedPerf | null {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const c = JSON.parse(raw) as CachedPerf;
      if (c.v !== CACHE_VERSION) return null;
      if (Date.now() - c.ts > CACHE_TTL_MS) return null;
      return c;
    } catch { return null; }
  }
  private writeCache(c: CachedPerf): void {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(c)); } catch { /* ignore */ }
  }
  private clearCache(): void {
    try { localStorage.removeItem(CACHE_KEY); } catch { /* ignore */ }
  }
}
