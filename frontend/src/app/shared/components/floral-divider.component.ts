import { Component } from '@angular/core';

/**
 * Decorative botanical divider between sections: a centred spray of roses
 * (blush) and white flowers with eucalyptus leaves, symmetric around a small
 * gold centre. Inline SVG, lightweight, gently animated.
 */
@Component({
  selector: 'app-floral-divider',
  standalone: true,
  template: `
    <div class="fd" aria-hidden="true">
      <svg viewBox="0 0 600 160" class="fd__svg" preserveAspectRatio="xMidYMid meet">
        <!-- LEFT half -->
        <g>
          <!-- stem -->
          <path d="M300 80 C 248 76, 206 84, 150 80 C 126 78, 108 82, 92 80" class="fd__stem"/>
          <!-- leaves -->
          <g class="fd__leaf">
            <path d="M252 76 q 18 -15 34 -8 q -13 18 -34 8 z"/>
            <path d="M208 84 q -17 -15 -34 -9 q 12 18 34 9 z"/>
            <path d="M168 76 q 16 -14 31 -7 q -12 17 -31 7 z"/>
            <path d="M126 82 q -14 -12 -28 -7 q 10 15 28 7 z"/>
          </g>
          <!-- white flower (large) -->
          <g class="fd__white" transform="translate(210 78)">
            <g class="fd__spin">
              <ellipse cx="0" cy="-11" rx="4.4" ry="9.5" transform="rotate(0)"/>
              <ellipse cx="0" cy="-11" rx="4.4" ry="9.5" transform="rotate(72)"/>
              <ellipse cx="0" cy="-11" rx="4.4" ry="9.5" transform="rotate(144)"/>
              <ellipse cx="0" cy="-11" rx="4.4" ry="9.5" transform="rotate(216)"/>
              <ellipse cx="0" cy="-11" rx="4.4" ry="9.5" transform="rotate(288)"/>
            </g>
            <circle r="4" class="fd__pollen"/>
          </g>
          <!-- white flower (small) -->
          <g class="fd__white" transform="translate(140 82)">
            <ellipse cx="0" cy="-7" rx="2.8" ry="6.2" transform="rotate(0)"/>
            <ellipse cx="0" cy="-7" rx="2.8" ry="6.2" transform="rotate(72)"/>
            <ellipse cx="0" cy="-7" rx="2.8" ry="6.2" transform="rotate(144)"/>
            <ellipse cx="0" cy="-7" rx="2.8" ry="6.2" transform="rotate(216)"/>
            <ellipse cx="0" cy="-7" rx="2.8" ry="6.2" transform="rotate(288)"/>
            <circle r="2.6" class="fd__pollen"/>
          </g>
          <!-- rose (layered blush) -->
          <g transform="translate(256 80)">
            <circle r="19" class="fd__rose-3"/>
            <circle r="13" class="fd__rose-2"/>
            <circle r="7" class="fd__rose-1"/>
            <path d="M-19 0 A19 19 0 0 1 19 0" class="fd__rose-line"/>
            <path d="M-12 -2 A12 12 0 0 1 12 -2" class="fd__rose-line"/>
            <path d="M-6 -1 A6 6 0 0 1 6 -1" class="fd__rose-line"/>
          </g>
        </g>

        <!-- RIGHT half: clean mirror of the same group -->
        <g transform="translate(600 0) scale(-1 1)">
          <path d="M300 80 C 248 76, 206 84, 150 80 C 126 78, 108 82, 92 80" class="fd__stem"/>
          <g class="fd__leaf">
            <path d="M252 76 q 18 -15 34 -8 q -13 18 -34 8 z"/>
            <path d="M208 84 q -17 -15 -34 -9 q 12 18 34 9 z"/>
            <path d="M168 76 q 16 -14 31 -7 q -12 17 -31 7 z"/>
            <path d="M126 82 q -14 -12 -28 -7 q 10 15 28 7 z"/>
          </g>
          <g class="fd__white" transform="translate(210 78)">
            <g class="fd__spin">
              <ellipse cx="0" cy="-11" rx="4.4" ry="9.5" transform="rotate(0)"/>
              <ellipse cx="0" cy="-11" rx="4.4" ry="9.5" transform="rotate(72)"/>
              <ellipse cx="0" cy="-11" rx="4.4" ry="9.5" transform="rotate(144)"/>
              <ellipse cx="0" cy="-11" rx="4.4" ry="9.5" transform="rotate(216)"/>
              <ellipse cx="0" cy="-11" rx="4.4" ry="9.5" transform="rotate(288)"/>
            </g>
            <circle r="4" class="fd__pollen"/>
          </g>
          <g class="fd__white" transform="translate(140 82)">
            <ellipse cx="0" cy="-7" rx="2.8" ry="6.2" transform="rotate(0)"/>
            <ellipse cx="0" cy="-7" rx="2.8" ry="6.2" transform="rotate(72)"/>
            <ellipse cx="0" cy="-7" rx="2.8" ry="6.2" transform="rotate(144)"/>
            <ellipse cx="0" cy="-7" rx="2.8" ry="6.2" transform="rotate(216)"/>
            <ellipse cx="0" cy="-7" rx="2.8" ry="6.2" transform="rotate(288)"/>
            <circle r="2.6" class="fd__pollen"/>
          </g>
          <g transform="translate(256 80)">
            <circle r="19" class="fd__rose-3"/>
            <circle r="13" class="fd__rose-2"/>
            <circle r="7" class="fd__rose-1"/>
            <path d="M-19 0 A19 19 0 0 1 19 0" class="fd__rose-line"/>
            <path d="M-12 -2 A12 12 0 0 1 12 -2" class="fd__rose-line"/>
            <path d="M-6 -1 A6 6 0 0 1 6 -1" class="fd__rose-line"/>
          </g>
        </g>
      </svg>
    </div>
  `,
  styles: [`
    .fd { width: 100%; display: flex; justify-content: center; padding: 18px 0; }
    .fd__svg { width: min(760px, 92vw); height: auto; overflow: visible; }

    .fd__stem { fill: none; stroke: rgba(126,147,103,.55); stroke-width: 1.6; stroke-linecap: round; }
    .fd__leaf path { fill: rgba(126,147,103,.42); }

    .fd__white ellipse { fill: #ffffff; stroke: rgba(216,165,147,.3); stroke-width: .7; }
    .fd__pollen { fill: #e9d199; }

    .fd__rose-3 { fill: rgba(216,165,147,.3); }
    .fd__rose-2 { fill: rgba(213,165,147,.5); }
    .fd__rose-1 { fill: rgba(197,135,114,.72); }
    .fd__rose-line { fill: none; stroke: rgba(255,255,255,.6); stroke-width: 1.1; }

    /* gentle life */
    .fd__spin { transform-origin: 210px 78px; animation: fd-rot 30s linear infinite; }
    .fd__white { animation: fd-breathe 5s ease-in-out infinite; }

    @keyframes fd-rot { to { transform: rotate(360deg); } }
    @keyframes fd-breathe { 0%,100% { opacity: .92; } 50% { opacity: 1; } }
  `]
})
export class FloralDividerComponent {}
