import { Component, ChangeDetectionStrategy, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoaderService } from "../../../core/services/loader.service";

@Component({
  selector: "fb-loading-screen",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    @if (loader.isLoading()) {
      <div
        class="fixed inset-0 z-[10000] flex items-center justify-center bg-primary transition-opacity duration-700"
        [class.opacity-0]="loader.progress() === 100"
        aria-hidden="true"
      >
        <!-- ambient orbs -->
        <div
          class="glow-orb glow-orb--gold w-[500px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        ></div>

        <div class="relative flex flex-col items-center gap-10">
          <!-- Animated monogram -->
          <div class="relative w-32 h-32">
            <svg viewBox="0 0 100 100" class="w-full h-full animate-spin-slow">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(212,175,55,0.15)"
                stroke-width="1"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#D4AF37"
                stroke-width="1"
                stroke-dasharray="283"
                [attr.stroke-dashoffset]="283 - (283 * loader.progress()) / 100"
                stroke-linecap="round"
                transform="rotate(-90 50 50)"
                style="transition: stroke-dashoffset 0.4s ease;"
              />
            </svg>
            <div class="absolute inset-0 flex items-center justify-center p-5">
              <img
                src="assets/logo/log-mic.png"
                alt="Foto Bugeac"
                class="w-full h-full object-contain"
              />
            </div>
          </div>

          <div class="text-center space-y-3">
            <div
              class="font-display text-2xl tracking-[0.4em] text-offwhite/90 uppercase"
            >
              Foto Bugeac
            </div>
            <div
              class="font-body text-xs tracking-[0.3em] uppercase text-gold/70"
            >
              Se incarcă · {{ loader.progress() }}%
            </div>
          </div>

          <div class="h-[1px] w-64 bg-white/10 overflow-hidden rounded-full">
            <div
              class="h-full bg-gradient-to-r from-gold to-gold-champagne transition-all duration-300 ease-out"
              [style.width.%]="loader.progress()"
            ></div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [
    `
      @keyframes spin-slow {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
      .animate-spin-slow {
        animation: spin-slow 8s linear infinite;
      }
    `,
  ],
})
export class LoadingScreenComponent {
  protected readonly loader = inject(LoaderService);
}
