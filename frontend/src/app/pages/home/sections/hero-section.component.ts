import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="relative h-[100svh] min-h-[680px] w-full overflow-hidden">
      <!-- Cinematic video background -->
      <video #vid class="absolute inset-0 w-full h-full object-cover scale-105 will-change-transform"
             autoplay muted loop playsinline preload="metadata"
             poster="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=80">
        <source src="https://cdn.coverr.co/videos/coverr-a-quiet-lake-at-dusk-4801/1080p.mp4" type="video/mp4"/>
      </video>

      <!-- Layered gradients -->
      <div class="absolute inset-0 bg-gradient-to-b from-ink-950/60 via-ink-950/40 to-ink-950"></div>
      <div class="absolute inset-0 bg-lux-radial"></div>
      <div class="absolute inset-0 bg-lux-vignette"></div>

      <!-- Floating particles -->
      <div class="particles">
        <span class="particle" style="top:18%;left:12%;animation-delay:0s"></span>
        <span class="particle" style="top:32%;left:78%;animation-delay:1.5s"></span>
        <span class="particle" style="top:60%;left:22%;animation-delay:3s;width:4px;height:4px"></span>
        <span class="particle" style="top:75%;left:60%;animation-delay:4.2s;width:8px;height:8px"></span>
        <span class="particle" style="top:46%;left:50%;animation-delay:2s"></span>
        <span class="particle" style="top:84%;left:88%;animation-delay:6s"></span>
      </div>

      <!-- Content -->
      <div class="relative z-10 h-full container-luxe px-6 flex flex-col justify-end pb-32 md:pb-40">
        <span #eyebrow class="eyebrow opacity-0">Mirtanis Events · Locație pe lac</span>

        <h1 #title class="mt-6 font-display font-light text-white text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] leading-[1.02] tracking-tight max-w-5xl">
          <span class="block opacity-0" data-line>Transformăm momentele speciale</span>
          <span class="block gold-text opacity-0" data-line>în amintiri de neuitat.</span>
        </h1>

        <p #sub class="mt-8 max-w-2xl text-lg md:text-xl text-white/75 leading-relaxed opacity-0">
          O locație de poveste, în mijlocul unui lac superb — cort premium, sală elegantă,
          pontoane romantice și o atmosferă creată pentru evenimentul perfect.
        </p>

        <div #cta class="mt-10 flex flex-wrap gap-4 opacity-0">
          <a routerLink="/rezervari" class="btn btn-primary">Verifică disponibilitatea</a>
          <a routerLink="/contact" class="btn btn-ghost">Programează o vizită</a>
        </div>
      </div>

      <!-- Scroll indicator -->
      <div class="absolute bottom-8 inset-x-0 z-10 flex flex-col items-center gap-3 text-white/60">
        <span class="eyebrow text-[10px]">scroll</span>
        <span class="relative block h-12 w-px bg-white/20 overflow-hidden">
          <span class="absolute inset-x-0 top-0 h-4 bg-gold-400 animate-[shimmer_2s_ease-in-out_infinite]"></span>
        </span>
      </div>
    </section>
  `
})
export class HeroSectionComponent implements AfterViewInit {
  @ViewChild('title') title!: ElementRef<HTMLElement>;
  @ViewChild('sub') sub!: ElementRef<HTMLElement>;
  @ViewChild('cta') cta!: ElementRef<HTMLElement>;
  @ViewChild('eyebrow') eyebrow!: ElementRef<HTMLElement>;

  async ngAfterViewInit(): Promise<void> {
    if (typeof window === 'undefined') return;
    try {
      const anime = (await import('animejs')).default;
      const lines = this.title.nativeElement.querySelectorAll<HTMLElement>('[data-line]');

      anime.timeline({ easing: 'cubicBezier(.16,1,.3,1)' })
        .add({ targets: this.eyebrow.nativeElement, opacity: [0, 1], translateY: [12, 0], duration: 900 })
        .add({ targets: lines, opacity: [0, 1], translateY: [60, 0], duration: 1400, delay: anime.stagger(180) }, '-=600')
        .add({ targets: this.sub.nativeElement, opacity: [0, 1], translateY: [30, 0], duration: 1100 }, '-=900')
        .add({ targets: this.cta.nativeElement, opacity: [0, 1], translateY: [20, 0], duration: 900 }, '-=700');
    } catch {
      // graceful: just reveal
      [this.eyebrow, this.title, this.sub, this.cta].forEach((r) => (r.nativeElement.style.opacity = '1'));
      this.title.nativeElement.querySelectorAll<HTMLElement>('[data-line]').forEach((l) => (l.style.opacity = '1'));
    }
  }
}
