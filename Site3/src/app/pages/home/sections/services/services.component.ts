import {
  Component,
  ChangeDetectionStrategy,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevealOnScrollDirective } from '../../../../core/directives/reveal-on-scroll.directive';

interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
  image: string;
  icon: string;
}

@Component({
  selector: 'fb-services',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RevealOnScrollDirective],
  template: `
    <section
      id="services"
      class="relative section-padding bg-primary overflow-hidden"
      aria-label="Servicii"
    >
      <!-- Ambient orbs -->
      <div
        class="glow-orb glow-orb--gold w-[500px] h-[500px] -top-32 -right-32 opacity-30"
      ></div>

      <div class="container-elegant relative">
        <!-- Section header -->
        <div class="text-center mb-20" fbReveal="fade">
          <div
            class="inline-flex items-center gap-3 mb-5 text-[11px] tracking-[0.4em] uppercase text-gold/80"
          >
            <span class="h-[1px] w-10 bg-gold/40"></span>
            <span>Ce realizăm</span>
            <span class="h-[1px] w-10 bg-gold/40"></span>
          </div>
          <h2
            class="text-display text-5xl md:text-6xl lg:text-7xl text-offwhite mb-6 text-balance"
          >
            Servicii <em class="text-gold-gradient not-italic">croite</em>
            <br />pentru fiecare poveste.
          </h2>
          <p
            class="max-w-2xl mx-auto text-offwhite/60 leading-relaxed text-balance"
          >
            De la șoapta unui botez până la drama copleșitoare a unei nunți,
            fiecare comandă este construită în jurul luminii tale, poveștii
            tale, momentelor tale.
          </p>
        </div>

        <!-- Services grid -->
        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7"
          fbReveal="stagger"
        >
          @for (service of services; track service.id; let i = $index) {
            <article
              class="service-card group relative overflow-hidden rounded-2xl glass cursor-pointer transition-all duration-700 hover:-translate-y-2 hover:shadow-glow"
              [attr.data-id]="service.id"
              tabindex="0"
            >
              <!-- Image -->
              <div class="relative h-72 overflow-hidden">
                <img
                  [src]="service.image"
                  [alt]="service.title"
                  loading="lazy"
                  class="w-full h-full object-cover transition-transform duration-[1500ms] ease-cinematic group-hover:scale-110"
                />
                <div
                  class="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent"
                ></div>
                <div
                  class="absolute inset-0 bg-gradient-to-br from-gold/20 to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-700 mix-blend-overlay"
                ></div>

                <!-- Floating icon -->
                <div
                  class="absolute top-5 right-5 w-12 h-12 rounded-full glass-gold flex items-center justify-center text-gold group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500"
                  [innerHTML]="service.icon"
                ></div>

                <!-- Number -->
                <span
                  class="absolute top-5 left-5 font-display text-sm text-offwhite/40 tracking-widest"
                  >0{{ i + 1 }}</span
                >
              </div>

              <!-- Body -->
              <div class="p-7 relative">
                <h3
                  class="font-display text-3xl text-offwhite mb-3 group-hover:text-gold transition-colors duration-500"
                >
                  {{ service.title }}
                </h3>
                <p class="text-sm text-offwhite/60 leading-relaxed mb-5">
                  {{ service.description }}
                </p>
                <ul class="space-y-2 mb-5">
                  @for (f of service.features; track f) {
                    <li class="flex items-start gap-2 text-xs text-offwhite/55">
                      <span class="text-gold mt-1">✦</span>
                      <span>{{ f }}</span>
                    </li>
                  }
                </ul>

                <div
                  class="flex items-center gap-2 text-xs tracking-[0.3em] uppercase text-gold opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500"
                >
                  Descoperă
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    class="w-4 h-4"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" />
                  </svg>
                </div>
              </div>

              <!-- Animated border -->
              <span class="card-border" aria-hidden="true"></span>
            </article>
          }
        </div>

        <!-- Additional services strip -->
        <div
          class="mt-20 glass-strong rounded-2xl p-8 md:p-12"
          fbReveal="fade"
        >
          <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div>
              <h3 class="font-display text-3xl text-offwhite mb-3">
                Servicii complementare.
              </h3>
              <p class="text-offwhite/60 max-w-lg">
                Dincolo de declanșator — oferim întreaga experiență de atelier.
              </p>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-3 text-sm">
              @for (a of additional; track a) {
                <div class="flex items-center gap-2 text-offwhite/70">
                  <span class="text-gold text-xs">✦</span>{{ a }}
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .service-card {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.06);
      }
      .service-card:hover {
        border-color: rgba(212, 175, 55, 0.3);
      }

      .card-border {
        position: absolute;
        inset: 0;
        border-radius: 1rem;
        padding: 1px;
        background: linear-gradient(
          135deg,
          transparent 30%,
          rgba(212, 175, 55, 0.6) 50%,
          transparent 70%
        );
        background-size: 200% 200%;
        background-position: -100% -100%;
        -webkit-mask:
          linear-gradient(#fff 0 0) content-box,
          linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        opacity: 0;
        transition: all 0.8s;
        pointer-events: none;
      }
      .service-card:hover .card-border {
        opacity: 1;
        background-position: 100% 100%;
      }
    `,
  ],
})
export class ServicesComponent {
  protected readonly services: Service[] = [
    {
      id: 'weddings',
      title: 'Nunți',
      description:
        'Fotografie cinematografică de nuntă care surprinde emoția, lumina și povestea zilei tale cu măiestrie atemporală.',
      features: [
        'Poveste cinematografică',
        'Momente candide emoționante',
        'Editare premium & album',
      ],
      image:
        'assets/portfolio/nunta-1-16-9.jpg',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-5 h-5"><path d="M12 21s-7-4.5-7-11a4 4 0 017-2.6A4 4 0 0119 10c0 6.5-7 11-7 11z" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    },
    {
      id: 'baptisms',
      title: 'Botezuri',
      description:
        'Fotografie caldă și intimă a momentelor de familie — duioșie, lumină și poezia liniștită a începuturilor.',
      features: [
        'Momente autentice de familie',
        'Tonuri cinematografice calde',
        'Tipărituri de patrimoniu',
      ],
      image:
        'assets/portfolio/botez-1-16-9.jpg',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-5 h-5"><path d="M12 2v6m0 0a4 4 0 014 4v4a4 4 0 01-8 0v-4a4 4 0 014-4z" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    },
    {
      id: 'events',
      title: 'Evenimente & Petreceri',
      description:
        'De la gale corporative la aniversări — fiecare eveniment spus cu energie cinematografică și șlefuire editorială.',
      features: [
        'Aniversări & zile de naștere',
        'Evenimente corporative & gale',
        'Petreceri private',
      ],
      image:
        'assets/portfolio/FOTO-BUGEAC-358.jpg',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-5 h-5"><path d="M5 8h14l-1 12H6L5 8zm2-3a3 3 0 016 0M11 5h6M9 12v4m6-4v4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    },
    {
      id: 'studio',
      title: 'Fotografie de Studio',
      description:
        'Un mediu controlat pentru portrete de calitate editorială — familii, cupluri, maternitate, nou-născuți și fashion.',
      features: [
        'Familie, cuplu & maternitate',
        'Nou-născuți & copii',
        'Portrete editoriale & fashion',
      ],
      image:
        'assets/portfolio/nunta-5-9-16.jpg',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-5 h-5"><rect x="3" y="6" width="18" height="13" rx="2"/><circle cx="12" cy="12.5" r="3.5"/><path d="M8 6l1.5-2h5L16 6"/></svg>',
    },
    {
      id: 'fashion',
      title: 'Fashion & Editorial',
      description:
        'Fotografie editorială high-fashion cu lumină sculptată, stil intenționat și retușare de revistă.',
      features: [
        'Lookbook-uri & campanii',
        'Concepte editoriale',
        'Retușare de revistă',
      ],
      image:
        'assets/portfolio/nunta-3-9-16.jpg',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-5 h-5"><path d="M8 3l4 4 4-4 4 6-6 4v8H10v-8L4 9l4-6z" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    },
    {
      id: 'drone',
      title: 'Dronă & Cinema',
      description:
        'Cinematografie aeriană și videografie — povești cinematografice de amploare care înnobilează fiecare comandă.',
      features: [
        'Cinematografie aeriană 4K',
        'Filme de nuntă & teasere',
        'Conținut social media',
      ],
      image:
        'assets/portfolio/FOTO-BUGEAC-313-of-321.jpg',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-5 h-5"><circle cx="12" cy="12" r="3"/><path d="M5 5l3 3M19 5l-3 3M5 19l3-3M19 19l-3-3"/></svg>',
    },
  ];

  protected readonly additional = [
    'Editare foto',
    'Retușare profesională',
    'Albume foto',
    'Fotografie cu drona',
    'Videografie',
    'Conținut social media',
  ];
}
