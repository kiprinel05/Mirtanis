import { Component, OnInit, inject, signal } from '@angular/core';
import { AppStateService } from '../../core/services/app-state.service';
import { dismissBootLoader } from '../boot-loader';

/**
 * Elegant intro loader: a gold ring draws itself around the Mirtanis monogram,
 * then the whole curtain lifts away — flipping AppState.ready so the hero
 * entrance plays in sync with the reveal.
 */
@Component({
  selector: 'app-loader',
  standalone: true,
  template: `
    @if (visible()) {
      <div class="loader" [class.loader--out]="leaving()" aria-hidden="true">
        <div class="loader__inner">
          <svg viewBox="0 0 140 140" class="loader__ring">
            <circle cx="70" cy="70" r="60" class="loader__track" />
            <circle cx="70" cy="70" r="60" class="loader__draw" />
          </svg>
          <img src="/logo-mare.png" alt="Mirtanis Events" class="loader__logo" />
        </div>
        <p class="loader__sub">EVENTS · PE LAC</p>
      </div>
    }
  `,
  styles: [`
    .loader {
      position: fixed; inset: 0; z-index: 9999;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      gap: 18px;
      background: radial-gradient(70% 60% at 50% 30%, #fffdfa 0%, #f7f1e7 60%, #f0e7d7 100%);
      transition: opacity .8s ease, transform .9s cubic-bezier(.7,0,.3,1);
    }
    .loader--out { opacity: 0; transform: scale(1.06); pointer-events: none; }

    .loader__inner { position: relative; display: grid; place-items: center; width: 220px; height: 160px; }
    .loader__ring {
      position: absolute; width: 230px; height: 230px; transform: rotate(-90deg);
    }
    .loader__track { fill: none; stroke: rgba(205,162,75,.16); stroke-width: 1; }
    .loader__draw {
      fill: none; stroke: #cda24b; stroke-width: 1.5; stroke-linecap: round;
      stroke-dasharray: 377; stroke-dashoffset: 377;
      animation: loader-draw 1.6s cubic-bezier(.7,0,.3,1) forwards;
    }
    .loader__logo {
      position: relative; width: 200px; max-width: 60vw; height: auto;
      opacity: 0; animation: loader-pop 1s cubic-bezier(.22,1,.36,1) .25s forwards;
      filter: drop-shadow(0 4px 18px rgba(154,114,46,.25));
    }
    .loader__sub {
      font-size: 10px; letter-spacing: .42em; color: #a9a092;
      opacity: 0; animation: loader-fade .8s ease .8s forwards;
    }
    @keyframes loader-draw { to { stroke-dashoffset: 0; } }
    @keyframes loader-pop { from { opacity: 0; transform: scale(.85); } to { opacity: 1; transform: scale(1); } }
    @keyframes loader-fade { to { opacity: 1; } }
  `]
})
export class LoaderComponent implements OnInit {
  private readonly appState = inject(AppStateService);
  readonly visible = signal(true);
  readonly leaving = signal(false);

  ngOnInit(): void {
    // The Angular curtain already covers the screen, so drop the static boot
    // loader underneath it right away (it's hidden — no flash).
    dismissBootLoader();

    const MIN_MS = 1300;
    const start = performance.now();

    const finish = () => {
      const wait = Math.max(0, MIN_MS - (performance.now() - start));
      setTimeout(() => {
        this.leaving.set(true);
        this.appState.ready.set(true);          // hero entrance fires now
        setTimeout(() => this.visible.set(false), 900);
      }, wait);
    };

    if (document.readyState === 'complete') finish();
    else window.addEventListener('load', finish, { once: true });

    setTimeout(finish, 4500); // safety net
  }
}
