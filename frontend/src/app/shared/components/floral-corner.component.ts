import { Component, Input } from '@angular/core';

type Corner = 'tl' | 'tr' | 'bl' | 'br';
type Variant = 'rose' | 'eucalyptus' | 'wildflower';

/**
 * Decorative animated floral branch placed in a section corner.
 * Lightweight inline SVG that gently sways. Three botanical variants.
 *
 *   <app-floral-corner corner="tr" variant="eucalyptus" />
 */
@Component({
  selector: 'app-floral-corner',
  standalone: true,
  template: `
    <svg class="floral-deco" [class]="'floral-deco--' + corner"
         [style.width.px]="size" viewBox="0 0 200 200" fill="none" aria-hidden="true">

      @switch (variant) {
        @case ('eucalyptus') {
          <!-- arching stem with round eucalyptus leaves -->
          <path d="M4 4 C 60 24, 96 60, 104 130 C 106 152, 100 172, 88 190"
                stroke="currentColor" stroke-width="1.4" stroke-linecap="round" opacity=".6" />
          @for (l of euc; track $index) {
            <ellipse [attr.cx]="l.x" [attr.cy]="l.y" rx="11" ry="8"
                     [attr.transform]="'rotate(' + l.r + ' ' + l.x + ' ' + l.y + ')'"
                     fill="currentColor" [attr.opacity]="l.o" />
          }
        }
        @case ('wildflower') {
          <!-- thin stems topped with little daisies -->
          @for (s of wild; track $index) {
            <path [attr.d]="s.d" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" opacity=".5" />
            <g [attr.transform]="'translate(' + s.x + ' ' + s.y + ')'">
              @for (p of petals8; track $index) {
                <ellipse cx="0" cy="-7" rx="2.4" ry="5"
                         [attr.transform]="'rotate(' + (p * 45) + ')'"
                         fill="currentColor" opacity=".4" />
              }
              <circle r="3" fill="currentColor" opacity=".7" />
            </g>
          }
        }
        @default {
          <!-- rose branch (default) -->
          <path d="M2 2 C 50 20, 80 50, 95 100 C 102 124, 100 150, 92 180"
                stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity=".7" />
          <path d="M40 22 C 60 18, 78 28, 86 46" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity=".55" />
          <path d="M70 58 C 92 56, 108 66, 116 86" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity=".55" />
          <path d="M40 22 q 16 -14 30 -6 q -12 16 -30 6 z" fill="currentColor" opacity=".35" />
          <path d="M70 58 q 18 -12 32 -2 q -14 16 -32 2 z" fill="currentColor" opacity=".3" />
          <g transform="translate(92 100)">
            <circle r="13" fill="currentColor" opacity=".18" />
            <circle r="8.5" fill="currentColor" opacity=".3" />
            <circle r="4.5" fill="currentColor" opacity=".5" />
          </g>
          <g transform="translate(86 46)">
            <circle r="9" fill="currentColor" opacity=".18" />
            <circle r="5.5" fill="currentColor" opacity=".32" />
            <circle r="2.8" fill="currentColor" opacity=".55" />
          </g>
          <g transform="translate(116 86)">
            <circle r="7.5" fill="currentColor" opacity=".18" />
            <circle r="4.5" fill="currentColor" opacity=".32" />
            <circle r="2.3" fill="currentColor" opacity=".55" />
          </g>
        }
      }
    </svg>
  `
})
export class FloralCornerComponent {
  @Input() corner: Corner = 'tr';
  @Input() variant: Variant = 'rose';
  @Input() size = 150;

  readonly petals8 = [0, 1, 2, 3, 4, 5, 6, 7];

  readonly euc = [
    { x: 30, y: 26, r: -30, o: .32 }, { x: 52, y: 44, r: 20, o: .38 },
    { x: 70, y: 66, r: -25, o: .3 }, { x: 88, y: 92, r: 30, o: .36 },
    { x: 98, y: 120, r: -20, o: .3 }, { x: 100, y: 150, r: 15, o: .34 }
  ];

  readonly wild = [
    { d: 'M30 196 C 28 150, 36 110, 44 70', x: 44, y: 64 },
    { d: 'M58 196 C 60 160, 56 124, 64 96', x: 64, y: 90 },
    { d: 'M16 196 C 14 168, 20 140, 26 116', x: 26, y: 110 }
  ];
}
