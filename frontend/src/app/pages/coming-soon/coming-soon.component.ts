import { Component, OnInit } from '@angular/core';
import { IMAGES } from '../../shared/data/images';

@Component({
  selector: 'app-coming-soon',
  standalone: true,
  template: `
    <main class="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 py-16 text-center">
      <!-- Background -->
      <div class="absolute inset-0">
        <img [src]="bg" alt="" class="h-full w-full animate-ken-burns object-cover" />
        <div class="absolute inset-0 bg-gradient-to-b from-cream-50/55 via-cream-50/35 to-cream-100/92"></div>
        <div class="absolute inset-0"
             style="background: radial-gradient(60% 55% at 50% 45%, rgba(40,30,16,0.38) 0%, rgba(40,30,16,0.16) 42%, rgba(40,30,16,0) 72%);"></div>
      </div>

      <!-- Falling petals -->
      <div class="pointer-events-none absolute inset-0 overflow-hidden">
        @for (p of petals; track $index) {
          <span class="petal" [style.left.%]="p.l" [style.animation-delay.s]="p.d" [style.animation-duration.s]="p.dur"></span>
        }
      </div>

      <!-- Content -->
      <div class="relative z-10 flex max-w-2xl flex-col items-center" style="text-shadow: 0 2px 26px rgba(30,22,10,0.35);">
        <img src="/logo-mare.png" alt="Mirtanis Events"
             class="cs-logo w-[280px] max-w-[78vw] sm:w-[360px]"
             style="filter: drop-shadow(0 6px 24px rgba(120,90,30,.3));" />

        <div class="cs-line mt-8 flex items-center gap-4 text-cream-50/90" style="animation-delay:.5s">
          <span class="h-px w-10 bg-cream-50/50 sm:w-14"></span>
          <span class="text-[11px] uppercase tracking-widest2 sm:text-xs">Pe malul lacului</span>
          <span class="h-px w-10 bg-cream-50/50 sm:w-14"></span>
        </div>

        <h1 class="cs-line mt-6 font-display text-4xl leading-tight text-cream-50 sm:text-5xl lg:text-6xl" style="animation-delay:.65s">
          Locația voastră preferată<br class="hidden sm:block" /> este în curs de pregătire
        </h1>

        <p class="cs-line mt-6 max-w-xl text-base text-cream-50/90 sm:text-lg" style="animation-delay:.8s">
          Pregătim un loc de poveste pentru nunți, botezuri și evenimente private.
          Revenim foarte curând cu toate detaliile — vă mulțumim pentru răbdare.
        </p>
      </div>

      <p class="cs-line absolute bottom-6 left-0 right-0 z-10 text-center text-xs text-ink-500" style="animation-delay:1.1s">
        © {{ year }} Mirtanis Events
      </p>
    </main>
  `,
  styles: [`
    :host { display: block; }

    .cs-logo { opacity: 0; animation: cs-pop 1.1s cubic-bezier(.22,1,.36,1) .15s forwards; }
    .cs-line { opacity: 0; animation: cs-up 1s cubic-bezier(.22,1,.36,1) forwards; }

    @keyframes cs-pop { from { opacity: 0; transform: scale(.9); } to { opacity: 1; transform: scale(1); } }
    @keyframes cs-up  { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }

    .petal {
      position: absolute; top: -6%;
      width: 12px; height: 12px; border-radius: 0 60% 0 60%;
      background: rgba(255, 240, 205, .6);
      animation-name: petal-fall; animation-timing-function: linear; animation-iteration-count: infinite;
    }
    @keyframes petal-fall {
      0%   { transform: translateY(0) rotate(0deg); opacity: 0; }
      10%  { opacity: .8; }
      100% { transform: translateY(110vh) rotate(420deg); opacity: 0; }
    }
  `]
})
export class ComingSoonComponent implements OnInit {
  readonly bg = IMAGES.heroLake;
  readonly year = new Date().getFullYear();

  readonly petals = Array.from({ length: 18 }, () => ({
    l: Math.round(Math.random() * 100),
    d: +(Math.random() * 9).toFixed(1),
    dur: +(9 + Math.random() * 8).toFixed(1)
  }));

  ngOnInit(): void {
    // Remove the static pre-bootstrap loader once this page renders.
    document.getElementById('boot-loader')?.remove();
  }
}
