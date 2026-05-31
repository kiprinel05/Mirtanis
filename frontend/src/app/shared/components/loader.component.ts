import { Component, OnInit, inject, signal } from '@angular/core';
import { AppStateService } from '../../core/services/app-state.service';
import { dismissBootLoader } from '../boot-loader';

/**
 * Intro loader: warm backdrop with drifting gold petals + a soft animated
 * gradient sheen, the logo eases in, and a thin progress bar fills underneath.
 * The whole curtain then lifts, syncing the hero entrance via AppState.ready.
 */
@Component({
  selector: 'app-loader',
  standalone: true,
  template: `
    @if (visible()) {
      <div class="loader" [class.loader--out]="leaving()" aria-hidden="true">
        <!-- animated background layers -->
        <div class="loader__sheen"></div>
        <div class="pointer-events-none absolute inset-0 overflow-hidden">
          @for (p of petals; track $index) {
            <span class="petal" [style.left.%]="p.l"
                  [style.animation-delay.s]="p.d"
                  [style.animation-duration.s]="p.dur"
                  [style.--size.px]="p.s"></span>
          }
        </div>

        <!-- centre stack -->
        <div class="loader__stack">
          <div class="loader__emblem">
            <svg viewBox="0 0 240 240" class="loader__ring">
              <circle cx="120" cy="120" r="116" class="loader__ring-track" />
              <circle cx="120" cy="120" r="116" class="loader__ring-arc" />
            </svg>
            <span class="loader__glow"></span>
            <img src="/logo-mare.png" alt="Mirtanis Events" class="loader__logo" />
          </div>

          <div class="loader__bar"><span class="loader__bar-fill"></span></div>

          <p class="loader__text">
            Se încarcă<span class="loader__dots"><i>.</i><i>.</i><i>.</i></span>
          </p>
        </div>
      </div>
    }
  `,
  styles: [`
    .loader {
      position: fixed; inset: 0; z-index: 9999; overflow: hidden;
      display: grid; place-items: center;
      background:
        radial-gradient(130% 90% at 50% 0%, #fffefb 0%, #fbf5ea 48%, #f3ead9 100%);
      transition: opacity .8s ease, transform 1s cubic-bezier(.7,0,.3,1);
    }
    .loader--out { opacity: 0; transform: scale(1.04); pointer-events: none; }

    /* slow rotating gold sheen sweeping the backdrop */
    .loader__sheen {
      position: absolute; left: 50%; top: 50%;
      width: 160vmax; height: 160vmax; transform: translate(-50%, -50%);
      background: conic-gradient(from 0deg,
        transparent 0deg,
        rgba(205,162,75,.10) 60deg,
        transparent 130deg,
        rgba(216,165,147,.08) 220deg,
        transparent 300deg);
      animation: sheen-spin 14s linear infinite;
    }
    @keyframes sheen-spin { to { transform: translate(-50%, -50%) rotate(360deg); } }

    .loader__stack {
      position: relative; z-index: 2;
      display: flex; flex-direction: column; align-items: center; gap: 26px;
    }

    /* emblem = rotating ring + pulsing glow + logo */
    .loader__emblem {
      position: relative; display: grid; place-items: center;
      width: 280px; height: 280px; max-width: 80vw;
    }
    .loader__ring {
      position: absolute; inset: 0; width: 100%; height: 100%;
      transform: rotate(-90deg);
      opacity: 0; animation: fade-in .8s ease .3s forwards;
    }
    .loader__ring-track { fill: none; stroke: rgba(205,162,75,.14); stroke-width: 1; }
    .loader__ring-arc {
      fill: none; stroke: #cda24b; stroke-width: 1.5; stroke-linecap: round;
      stroke-dasharray: 120 729;
      animation: ring-spin 2.2s linear infinite;
    }
    @keyframes ring-spin { to { stroke-dashoffset: -849; } }

    .loader__glow {
      position: absolute; width: 62%; height: 62%; border-radius: 50%;
      background: radial-gradient(circle, rgba(233,209,153,.55), rgba(233,209,153,0) 70%);
      filter: blur(22px);
      animation: glow-pulse 3s ease-in-out infinite;
    }
    @keyframes glow-pulse {
      0%,100% { opacity: .45; transform: scale(.92); }
      50%     { opacity: .8;  transform: scale(1.08); }
    }

    .loader__logo {
      position: relative; z-index: 1;
      width: 200px; max-width: 56vw; height: auto;
      opacity: 0;
      animation: logo-in 1.1s cubic-bezier(.22,1,.36,1) .15s forwards,
                 logo-float 5s ease-in-out 1.2s infinite;
      filter: drop-shadow(0 8px 24px rgba(154,114,46,.25));
    }
    @keyframes logo-in {
      from { opacity: 0; transform: translateY(14px) scale(.95); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes logo-float {
      0%,100% { transform: translateY(0); }
      50%     { transform: translateY(-7px); }
    }

    /* loading text + animated dots */
    .loader__text {
      display: inline-flex; align-items: baseline;
      font-size: 11px; letter-spacing: .42em; text-transform: uppercase;
      color: #9a8a6a; text-indent: .42em;
      opacity: 0; animation: fade-in .8s ease .7s forwards;
    }
    .loader__dots { display: inline-flex; }
    .loader__dots i {
      font-style: normal;
      animation: dot 1.4s ease-in-out infinite;
    }
    .loader__dots i:nth-child(2) { animation-delay: .2s; }
    .loader__dots i:nth-child(3) { animation-delay: .4s; }
    @keyframes dot { 0%,100% { opacity: .2; } 50% { opacity: 1; } }

    /* thin progress bar with travelling shimmer */
    .loader__bar {
      position: relative; height: 2px; width: 200px; max-width: 56vw;
      border-radius: 999px; background: rgba(205,162,75,.18); overflow: hidden;
      opacity: 0; animation: fade-in .6s ease .5s forwards;
    }
    .loader__bar-fill {
      position: absolute; inset: 0; width: 0;
      background: linear-gradient(90deg, #b68a36, #e9d199);
      border-radius: 999px;
      animation: fill 1.7s cubic-bezier(.6,0,.2,1) .4s forwards;
    }
    .loader__bar-fill::after {
      content: ""; position: absolute; inset: 0;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,.75), transparent);
      transform: translateX(-100%);
      animation: bar-shine 1.4s ease-in-out .6s infinite;
    }
    @keyframes fade-in { to { opacity: 1; } }
    @keyframes fill { to { width: 100%; } }
    @keyframes bar-shine { 0%{transform:translateX(-100%)} 60%,100%{transform:translateX(220%)} }

    /* drifting gold petals */
    .petal {
      position: absolute; top: -6%;
      width: var(--size, 10px); height: var(--size, 10px);
      border-radius: 0 60% 0 60%;
      background: rgba(205,162,75,.32);
      animation-name: petal-fall; animation-timing-function: linear; animation-iteration-count: infinite;
    }
    @keyframes petal-fall {
      0%   { transform: translateY(0) rotate(0deg); opacity: 0; }
      12%  { opacity: .7; }
      100% { transform: translateY(112vh) rotate(420deg); opacity: 0; }
    }
  `]
})
export class LoaderComponent implements OnInit {
  private readonly appState = inject(AppStateService);
  readonly visible = signal(true);
  readonly leaving = signal(false);

  // Negative delays so petals are already mid-fall on the very first frame
  // (the loader only lives ~2s, so they must be visible immediately).
  readonly petals = Array.from({ length: 30 }, () => {
    const dur = +(3.5 + Math.random() * 2.5).toFixed(1);
    return {
      l: Math.round(Math.random() * 100),
      d: +(-Math.random() * dur).toFixed(1),   // negative → starts partway through
      dur,
      s: Math.round(6 + Math.random() * 10)
    };
  });

  ngOnInit(): void {
    // The Angular curtain already covers the screen, so drop the static boot
    // loader underneath it right away (it's hidden — no flash).
    dismissBootLoader();

    const MIN_MS = 2000;
    const start = performance.now();

    const finish = () => {
      const wait = Math.max(0, MIN_MS - (performance.now() - start));
      setTimeout(() => {
        this.leaving.set(true);
        this.appState.ready.set(true);          // hero entrance fires now
        setTimeout(() => this.visible.set(false), 1000);
      }, wait);
    };

    if (document.readyState === 'complete') finish();
    else window.addEventListener('load', finish, { once: true });

    setTimeout(finish, 4500); // safety net
  }
}
