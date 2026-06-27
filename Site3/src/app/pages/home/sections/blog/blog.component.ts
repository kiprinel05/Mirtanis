import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevealOnScrollDirective } from '../../../../core/directives/reveal-on-scroll.directive';

interface Article {
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  image: string;
  date: string;
}

@Component({
  selector: 'fb-blog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RevealOnScrollDirective],
  template: `
    <section
      id="blog"
      class="relative section-padding bg-primary overflow-hidden"
      aria-label="Jurnal"
    >
      <div
        class="glow-orb glow-orb--gold w-[500px] h-[500px] top-1/3 -left-32 opacity-20"
      ></div>

      <div class="container-elegant relative">
        <!-- Header -->
        <div
          class="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-14"
          fbReveal="fade"
        >
          <div>
            <div
              class="inline-flex items-center gap-3 mb-5 text-[11px] tracking-[0.4em] uppercase text-gold/80"
            >
              <span class="h-[1px] w-10 bg-gold/40"></span>
              <span>Jurnalul</span>
            </div>
            <h2
              class="text-display text-5xl md:text-6xl text-offwhite text-balance leading-[1.05]"
            >
              Inspirații &
              <em class="text-gold-gradient not-italic">povești</em>.
            </h2>
          </div>
          <a href="#" class="hover-underline text-gold text-sm tracking-[0.2em] uppercase"
            >Citește toate articolele →</a
          >
        </div>

        <!-- Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-7" fbReveal="stagger">
          @for (a of articles; track a.title) {
            <article
              class="group relative overflow-hidden rounded-2xl glass hover:-translate-y-2 transition-all duration-700"
            >
              <div class="relative h-60 overflow-hidden">
                <img
                  [src]="a.image"
                  [alt]="a.title"
                  loading="lazy"
                  class="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-110"
                />
                <div
                  class="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent"
                ></div>
                <span
                  class="absolute top-4 left-4 px-3 py-1 text-[10px] tracking-[0.3em] uppercase rounded-full glass-gold text-gold"
                  >{{ a.category }}</span
                >
              </div>
              <div class="p-6">
                <div
                  class="flex items-center gap-3 text-[10px] tracking-[0.3em] uppercase text-offwhite/40 mb-3"
                >
                  <span>{{ a.date }}</span>
                  <span class="text-gold">•</span>
                  <span>{{ a.readTime }}</span>
                </div>
                <h3
                  class="font-display text-2xl text-offwhite mb-3 leading-tight group-hover:text-gold transition-colors duration-500"
                >
                  {{ a.title }}
                </h3>
                <p class="text-sm text-offwhite/60 leading-relaxed mb-5">
                  {{ a.excerpt }}
                </p>
                <a
                  href="#"
                  class="inline-flex items-center gap-2 text-xs tracking-[0.3em] uppercase text-gold hover-underline"
                >
                  Citește mai mult
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    class="w-4 h-4"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" />
                  </svg>
                </a>
              </div>
            </article>
          }
        </div>
      </div>
    </section>
  `,
})
export class BlogComponent {
  protected readonly articles: Article[] = [
    {
      title: 'Cum să te pregătești pentru ședința foto de nuntă',
      excerpt:
        'Un ghid delicat despre lumină, sincronizare și detaliile mici care fac portretele de nuntă cu adevărat eterne.',
      category: 'Nunți',
      readTime: '6 min de citit',
      date: '12 Mai',
      image:
        'assets/portfolio/nunta-2-16-9.jpg',
    },
    {
      title: 'Cele 7 cele mai romantice locații foto din țară',
      excerpt:
        'De la capele de munte până la câmpuri pline de soare — căutate, testate și selectate pentru rezultate cinematografice.',
      category: 'Locații',
      readTime: '8 min de citit',
      date: '28 Apr',
      image:
        'assets/portfolio/nunta-4-16-9.jpg',
    },
    {
      title: 'Idei de ținute pentru fotografia de familie în studio',
      excerpt:
        'Un ghid de garderobă tip capsulă — culori, texturi și cum să te îmbraci pentru cameră fără să-ți pierzi stilul.',
      category: 'Studio',
      readTime: '5 min de citit',
      date: '14 Apr',
      image:
        'assets/portfolio/botez-2-16-9.jpg',
    },
  ];
}
