import {
  Component,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { ScrollService } from '../../../core/services/scroll.service';

@Component({
  selector: 'fb-scroll-progress',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="fixed top-0 left-0 right-0 h-[2px] z-[9998] pointer-events-none"
      aria-hidden="true"
    >
      <div
        class="h-full bg-gradient-to-r from-gold via-gold-champagne to-gold origin-left will-change-transform"
        [style.transform]="'scaleX(' + scroll.progress() + ')'"
        style="box-shadow: 0 0 12px rgba(212,175,55,0.7);"
      ></div>
    </div>
  `,
})
export class ScrollProgressComponent {
  protected readonly scroll = inject(ScrollService);
}
