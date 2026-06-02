import { Component, Input } from '@angular/core';
import { FloralCornerComponent } from './floral-corner.component';

/** Compact, elegant hero used at the top of inner pages. */
@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [FloralCornerComponent],
  template: `
    <header class="relative flex min-h-[58svh] items-center justify-center overflow-hidden">
      <div class="absolute inset-0">
        <img [src]="image" [alt]="title" class="h-full w-full animate-ken-burns object-cover" fetchpriority="high" />
        <!-- Top scrim for the navbar, centred focus glow + bottom fade into the page -->
        <div class="absolute inset-0 bg-gradient-to-b from-cream-50/30 via-transparent to-cream-100/95"></div>
        <div class="absolute inset-0"
             style="background: radial-gradient(62% 62% at 50% 46%, rgba(40,30,16,0.45) 0%, rgba(40,30,16,0.22) 42%, rgba(40,30,16,0) 74%);"></div>
      </div>

      <!-- floral flourishes -->
      <app-floral-corner corner="tl" variant="eucalyptus" [size]="180" />
      <app-floral-corner corner="br" variant="rose" [size]="180" />

      <div class="container-x relative z-10 pt-24 text-center" style="text-shadow: 0 2px 26px rgba(30,22,10,0.45);">
        @if (eyebrow) {
          <p class="script animate-fade-up text-3xl text-gold-100 sm:text-4xl" style="animation-delay:.05s">{{ eyebrow }}</p>
        }
        <h1 class="mt-2 animate-fade-up font-display text-5xl text-cream-50 sm:text-6xl lg:text-7xl" style="animation-delay:.18s">{{ title }}</h1>
        @if (subtitle) {
          <p class="mx-auto mt-5 max-w-xl animate-fade-up text-balance text-cream-50/90" style="animation-delay:.32s">{{ subtitle }}</p>
        }
        <div class="leaf-divider mt-7 animate-fade-up" style="animation-delay:.46s">
          <span class="!bg-cream-50/40"></span><span class="text-gold-200">✦</span><span class="!bg-cream-50/40"></span>
        </div>
      </div>
    </header>
  `,
  styles: [`
    /* keep the corner florals light over the photo */
    :host ::ng-deep .floral-deco { color: rgba(255,245,225,.45); z-index: 5; }
  `]
})
export class PageHeaderComponent {
  @Input({ required: true }) title = '';
  @Input() eyebrow = '';
  @Input() subtitle = '';
  @Input({ required: true }) image = '';
}
