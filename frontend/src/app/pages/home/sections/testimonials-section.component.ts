import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevealDirective } from '../../../shared/directives/reveal.directive';

interface Testimonial { name: string; role: string; text: string; }

@Component({
  selector: 'app-testimonials-section',
  standalone: true,
  imports: [CommonModule, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section relative">
      <div class="container-luxe">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div class="max-w-2xl">
            <span appReveal class="eyebrow">Ce spun invitații</span>
            <h2 appReveal [revealDelay]="100" class="mt-5 font-display text-4xl md:text-6xl text-white leading-[1.05]">
              <span class="gold-text">Emoții reale</span>, recenzii reale.
            </h2>
          </div>
          <div appReveal [revealDelay]="200" class="glass rounded-2xl px-6 py-4 flex items-center gap-4">
            <div class="text-gold-300 text-xl tracking-widest">★ ★ ★ ★ ★</div>
            <div>
              <p class="font-display text-3xl gold-text leading-none">4.5</p>
              <p class="text-xs eyebrow mt-1 text-white/60">Google Reviews</p>
            </div>
          </div>
        </div>

        <div class="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <article *ngFor="let t of testimonials; let i = index" appReveal [revealDelay]="i * 100"
                   class="group relative glass rounded-3xl p-8 transition-all duration-700 hover:-translate-y-2 hover:shadow-glow-gold">
            <div class="absolute inset-x-0 -top-px gold-line opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <span class="font-display italic text-7xl text-gold-400/40 leading-none">"</span>
            <p class="mt-2 text-white/85 font-display italic text-xl leading-relaxed">{{ t.text }}</p>
            <div class="mt-8 flex items-center justify-between">
              <div>
                <p class="text-white">{{ t.name }}</p>
                <p class="text-xs text-white/50">{{ t.role }}</p>
              </div>
              <div class="text-gold-300 tracking-wider">★★★★★</div>
            </div>
          </article>
        </div>
      </div>
    </section>
  `
})
export class TestimonialsSectionComponent {
  readonly testimonials: Testimonial[] = [
    { name: 'Andreea & Vlad', role: 'Nuntă pe lac', text: 'Locație de poveste. Un lac superb și locul perfect pentru evenimentul dorit.' },
    { name: 'Familia Popescu', role: 'Botez', text: 'Mâncarea super delicioasă, personal super agreabil. Atenție la fiecare detaliu.' },
    { name: 'Maria & Cristian', role: 'Cununie + Petrecere', text: 'Un loc de vis. Mirific locație pe lac — pur și simplu un loc de neuitat.' },
    { name: 'Eveniment corporate', role: 'Lansare brand', text: 'Servire uniformă, atmosferă rafinată. Cea mai frumoasă locație pentru evenimente.' },
    { name: 'Diana & Răzvan', role: 'Garden party', text: 'Pontoanele, luminile pe apă și cortul — totul ca în filme. Recomand din suflet.' },
    { name: 'Aniversare 50', role: 'Petrecere privată', text: 'Sala interioară este caldă și elegantă. Ne-am simțit ca într-un resort premium.' }
  ];
}
