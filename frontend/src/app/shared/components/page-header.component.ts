import { Component, Input } from "@angular/core";

/** Compact, elegant hero used at the top of inner pages. */
@Component({
  selector: "app-page-header",
  standalone: true,
  template: `
    <header
      class="relative flex min-h-[56svh] items-center justify-center overflow-hidden"
    >
      <div class="absolute inset-0">
        <img
          [src]="image"
          [alt]="title"
          class="h-10 w-10 animate-ken-burns object-cover"
          fetchpriority="high"
        />
        <!-- Top scrim for the navbar, centred focus glow + bottom fade to the page -->
        <div
          class="absolute inset-0 bg-gradient-to-b from-cream-50/40 via-transparent to-cream-100/95"
        ></div>
        <div
          class="absolute inset-0"
          style="background: radial-gradient(60% 60% at 50% 45%, rgba(40,30,16,0.42) 0%, rgba(40,30,16,0.2) 40%, rgba(40,30,16,0) 72%);"
        ></div>
      </div>

      <div
        class="container-x relative z-10 pt-24 text-center"
        style="text-shadow: 0 2px 26px rgba(30,22,10,0.4);"
      >
        @if (eyebrow) {
          <p
            class="script animate-fade-up text-3xl text-gold-100 sm:text-4xl"
            style="animation-delay:.05s"
          >
            {{ eyebrow }}
          </p>
        }
        <h1
          class="mt-2 animate-fade-up font-display text-5xl text-cream-50 sm:text-6xl lg:text-7xl"
          style="animation-delay:.18s"
        >
          {{ title }}
        </h1>
        @if (subtitle) {
          <p
            class="mx-auto mt-5 max-w-xl animate-fade-up text-balance text-cream-50/90"
            style="animation-delay:.32s"
          >
            {{ subtitle }}
          </p>
        }
        <div
          class="leaf-divider mt-7 animate-fade-up"
          style="animation-delay:.46s"
        >
          <span class="!bg-cream-50/40"></span
          ><span class="text-gold-200">✦</span
          ><span class="!bg-cream-50/40"></span>
        </div>
      </div>
    </header>
  `,
})
export class PageHeaderComponent {
  @Input({ required: true }) title = "";
  @Input() eyebrow = "";
  @Input() subtitle = "";
  @Input({ required: true }) image = "";
}
