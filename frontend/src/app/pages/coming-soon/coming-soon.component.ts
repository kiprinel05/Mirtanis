import { Component, AfterViewInit } from "@angular/core";
import { dismissBootLoader } from "../../shared/boot-loader";

@Component({
  selector: "app-coming-soon",
  standalone: true,
  template: `
    <main
      class="relative flex min-h-[100svh] flex-col overflow-hidden text-center text-cream-50"
    >
      <!-- Cinematic background -->
      <div class="absolute inset-0">
        <img
          [src]="bg"
          alt="Mirtanis Events — locație pe lac la apus"
          class="h-full w-full animate-ken-burns object-cover"
          fetchpriority="high"
        />
        <!-- Dark, warm overlays for perfect contrast -->
        <div
          class="absolute inset-0 bg-gradient-to-b from-[#1a1206]/75 via-[#1a1206]/55 to-[#1a1206]/85"
        ></div>
        <div
          class="absolute inset-0"
          style="background: radial-gradient(70% 60% at 50% 42%, rgba(0,0,0,0) 0%, rgba(15,10,4,0.45) 100%);"
        ></div>
      </div>

      <!-- Falling petals -->
      <div class="pointer-events-none absolute inset-0 overflow-hidden">
        @for (p of petals; track $index) {
          <span
            class="petal"
            [style.left.%]="p.l"
            [style.animation-delay.s]="p.d"
            [style.animation-duration.s]="p.dur"
            [style.--size.px]="p.s"
            [style.--op]="p.o"
          ></span>
        }
      </div>

      <!-- ===== Logo (top) ===== -->

      <!-- ===== Title (middle) ===== -->
      <div
        class="relative z-10 flex flex-1 flex-col items-center justify-center px-6"
        style="text-shadow: 0 2px 30px rgba(0,0,0,.5);"
      >
        <div class="relative cs-line" style="animation-delay:.45s">
          <span class="logo-halo"></span>
          <img
            src="/logo-gold-v2.png"
            alt="Mirtanis Events"
            class="relative w-[300px] max-w-[80vw] sm:w-[420px]"
            style="filter: drop-shadow(0 8px 26px rgba(0,0,0,.45));"
          />
        </div>

        <div
          class="cs-line mt-6 flex items-center gap-4"
          style="animation-delay:.55s"
        >
          <span class="div-rule"></span>
          <span class="div-diamond"></span>
          <span class="div-rule div-rule--flip"></span>
        </div>

        <h1
          class="cs-line mt-8 max-w-3xl font-display text-[2.5rem] leading-[1.05] text-cream-50 sm:text-6xl lg:text-7xl"
          style="animation-delay:.7s"
        >
          <span class="gold-strong">Povestea continuă în curând</span>
        </h1>

        <p
          class="cs-line mt-6 max-w-md text-base text-cream-50/85 sm:text-lg"
          style="animation-delay:.85s"
        >
          Noul nostru website este în pregătire.
        </p>
      </div>

      <!-- ===== Footer (bottom): social + contact ===== -->
      <footer
        class="cs-line relative z-10 px-6 pb-10 sm:pb-12"
        style="animation-delay:1s"
      >
        <div class="flex justify-center gap-4">
          <a
            [href]="social.instagram"
            target="_blank"
            rel="noopener"
            aria-label="Instagram"
            class="social-btn"
          >
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle
                cx="17.5"
                cy="6.5"
                r="1"
                fill="currentColor"
                stroke="none"
              />
            </svg>
          </a>
          <a
            [href]="social.facebook"
            target="_blank"
            rel="noopener"
            aria-label="Facebook"
            class="social-btn"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path
                d="M14 9h3l.5-3H14V4.5c0-.9.3-1.5 1.6-1.5H17V.3C16.7.2 15.8 0 14.7 0 12.3 0 11 1.4 11 4v2H8v3h3v9h3V9z"
              />
            </svg>
          </a>
        </div>

        <div
          class="mt-5 flex flex-col items-center justify-center gap-2 text-sm text-cream-50/75 sm:flex-row sm:gap-6"
        ></div>
      </footer>
    </main>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      /* ---- Logo + halo ---- */
      .cs-logo {
        opacity: 0;
        animation: cs-pop 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.15s forwards;
        filter: drop-shadow(0 8px 26px rgba(0, 0, 0, 0.45));
      }
      .logo-halo {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 150%;
        height: 240%;
        transform: translate(-50%, -50%);
        background: radial-gradient(
          ellipse at center,
          rgba(233, 209, 153, 0.4),
          rgba(233, 209, 153, 0) 60%
        );
        filter: blur(30px);
        opacity: 0;
        animation: halo-in 1.6s ease 0.35s forwards;
      }
      @keyframes halo-in {
        to {
          opacity: 1;
        }
      }

      /* ---- Entrance ---- */
      .cs-line {
        opacity: 0;
        animation: cs-up 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      }
      @keyframes cs-pop {
        from {
          opacity: 0;
          transform: scale(0.9);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
      @keyframes cs-up {
        from {
          opacity: 0;
          transform: translateY(26px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* ---- Divider ---- */
      .div-rule {
        display: block;
        height: 1px;
        width: 64px;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(233, 209, 153, 0.9)
        );
      }
      .div-rule--flip {
        transform: scaleX(-1);
      }
      .div-diamond {
        width: 9px;
        height: 9px;
        transform: rotate(45deg);
        background: linear-gradient(135deg, #f4e6c3, #cda24b);
        box-shadow: 0 0 16px rgba(233, 209, 153, 0.7);
      }

      /* ---- Headline shimmer ---- */
      .gold-strong {
        background: linear-gradient(
          100deg,
          #cda24b 0%,
          #f4e6c3 45%,
          #e9d199 55%,
          #cda24b 100%
        );
        background-size: 220% 100%;
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        animation: gold-pan 6s ease-in-out infinite;
      }
      @keyframes gold-pan {
        0%,
        100% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
      }

      /* ---- Social buttons ---- */
      .social-btn {
        display: grid;
        place-items: center;
        width: 46px;
        height: 46px;
        border-radius: 9999px;
        color: #fdf4df;
        border: 1px solid rgba(233, 209, 153, 0.45);
        background: rgba(255, 255, 255, 0.06);
        backdrop-filter: blur(6px);
        transition:
          transform 0.35s ease,
          background 0.35s ease,
          border-color 0.35s ease,
          color 0.35s ease;
      }
      .social-btn:hover {
        transform: translateY(-3px);
        background: rgba(205, 162, 75, 0.9);
        border-color: rgba(205, 162, 75, 0.9);
        color: #1a1206;
      }

      /* ---- Petals ---- */
      .petal {
        position: absolute;
        top: -6%;
        width: var(--size, 12px);
        height: var(--size, 12px);
        border-radius: 0 60% 0 60%;
        background: rgba(255, 240, 205, var(--op, 0.5));
        animation-name: petal-fall;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
      }
      @keyframes petal-fall {
        0% {
          transform: translateY(0) rotate(0deg);
          opacity: 0;
        }
        10% {
          opacity: 1;
        }
        100% {
          transform: translateY(112vh) rotate(440deg);
          opacity: 0;
        }
      }
    `,
  ],
})
export class ComingSoonComponent implements AfterViewInit {
  readonly bg = '/img-v2.jpg';

  // TODO: replace with the real social profiles
  readonly social = {
    instagram: "https://www.instagram.com/mirtanisevents/",
    facebook: "https://www.facebook.com/mirtanisevents/",
  };

  readonly petals = Array.from({ length: 22 }, () => ({
    l: Math.round(Math.random() * 100),
    d: +(Math.random() * 10).toFixed(1),
    dur: +(8 + Math.random() * 9).toFixed(1),
    s: Math.round(8 + Math.random() * 12),
    o: +(0.3 + Math.random() * 0.45).toFixed(2),
  }));

  ngAfterViewInit(): void {
    // Keep the (identical, dark) boot loader visible until the cinematic
    // background has actually loaded, then crossfade — no white flash, no jump.
    const img = new Image();
    img.onload = () => dismissBootLoader();
    img.onerror = () => dismissBootLoader();
    img.src = this.bg;
    // Safety net if the image hangs on a very poor connection.
    window.setTimeout(() => dismissBootLoader(), 2500);
  }
}
