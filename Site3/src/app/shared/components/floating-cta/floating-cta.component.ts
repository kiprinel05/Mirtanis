import {
  Component,
  ChangeDetectionStrategy,
  computed,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollService } from '../../../core/services/scroll.service';

@Component({
  selector: 'fb-floating-cta',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div
      class="fixed bottom-6 right-6 z-[9000] flex flex-col gap-3 md:hidden transition-all duration-500"
      [class.opacity-0]="!visible()"
      [class.translate-y-12]="!visible()"
      [class.pointer-events-none]="!visible()"
    >
      <a
        href="https://wa.me/40722288986"
        target="_blank"
        rel="noopener"
        aria-label="WhatsApp"
        class="w-14 h-14 rounded-full flex items-center justify-center bg-[#25D366] shadow-[0_8px_30px_rgba(37,211,102,0.5)] hover:scale-110 transition-transform"
      >
        <svg viewBox="0 0 24 24" class="w-7 h-7 text-white" fill="currentColor">
          <path
            d="M17.5 14.4c-.3-.2-1.7-.8-2-.9-.3-.1-.5-.2-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.7-1.7-.9-2.3-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4 0 1.4 1 2.8 1.2 3 .1.2 2 3.1 4.9 4.4.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 2-1.3.2-.6.2-1.2.2-1.3-.1-.2-.3-.3-.6-.4zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 4.9L2 22l5.3-1.3C8.7 21.5 10.3 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2z"
          />
        </svg>
      </a>

      <a
        href="tel:+40722288986"
        aria-label="Call"
        class="w-14 h-14 rounded-full flex items-center justify-center bg-gold text-primary shadow-glow hover:scale-110 transition-transform"
      >
        <svg viewBox="0 0 24 24" class="w-6 h-6" fill="currentColor">
          <path
            d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"
          />
        </svg>
      </a>
    </div>
  `,
})
export class FloatingCtaComponent {
  private readonly scroll = inject(ScrollService);
  protected readonly visible = computed(() => this.scroll.scrollY() > 600);
}
