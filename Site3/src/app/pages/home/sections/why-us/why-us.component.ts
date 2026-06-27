import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevealOnScrollDirective } from '../../../../core/directives/reveal-on-scroll.directive';
import { CounterDirective } from '../../../../core/directives/counter.directive';
import { ParallaxDirective } from '../../../../core/directives/parallax.directive';

interface Pillar {
  title: string;
  desc: string;
  icon: string;
}

@Component({
  selector: 'fb-why-us',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RevealOnScrollDirective, CounterDirective, ParallaxDirective],
  template: `
    <section
      id="why"
      class="relative section-padding bg-primary overflow-hidden"
      aria-label="De ce Foto Bugeac"
    >
      <div
        class="glow-orb glow-orb--warm w-[600px] h-[600px] top-1/2 -translate-y-1/2 -right-64 opacity-25"
      ></div>

      <div
        class="container-elegant relative grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
      >
        <!-- Image side -->
        <div class="relative" fbReveal="fade">
          <div class="relative aspect-[4/5] rounded-2xl overflow-hidden">
            <img
              src="assets/fotograf/alina-9-16.jpg"
              alt="Alina Bugeac — fotograf principal"
              loading="lazy"
              class="w-full h-full object-cover"
              [fbParallax]="-0.15"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>
          </div>

          <!-- Floating mini frame -->
          <div
            class="absolute -bottom-10 -left-6 md:-left-12 w-48 md:w-56 aspect-square rounded-2xl overflow-hidden border-4 border-primary shadow-elegant animate-float-slow"
          >
            <img
              src="assets/portfolio/nunta-2-16-9.jpg"
              alt="Detaliu eveniment"
              loading="lazy"
              class="w-full h-full object-cover"
            />
          </div>

          <!-- Floating badge -->
          <div
            class="absolute top-6 -right-3 md:-right-6 glass-strong rounded-2xl px-5 py-4 animate-float"
          >
            <div class="text-[10px] tracking-[0.3em] uppercase text-gold mb-1">
              Premiu
            </div>
            <div class="font-display text-xl text-offwhite">Recomandat 2024</div>
          </div>
        </div>

        <!-- Content side -->
        <div fbReveal="stagger">
          <div
            class="inline-flex items-center gap-3 mb-5 text-[11px] tracking-[0.4em] uppercase text-gold/80"
          >
            <span class="h-[1px] w-10 bg-gold/40"></span>
            <span>Studioul</span>
          </div>
          <h2
            class="text-display text-4xl md:text-5xl lg:text-6xl text-offwhite mb-6 text-balance leading-[1.05]"
          >
            De ce
            <em class="text-gold-gradient not-italic">Foto Bugeac</em>?
          </h2>
          <p class="text-offwhite/65 leading-relaxed mb-8 max-w-lg">
            Nu facem doar fotografii. Compunem povești vizuale cu lumină
            cinematografică, echipament premium și o prezență calmă care îți
            permite pur și simplu să trăiești momentul.
          </p>

          <!-- Pillars -->
          <ul class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
            @for (pillar of pillars; track pillar.title) {
              <li class="flex items-start gap-4 group">
                <div
                  class="shrink-0 w-12 h-12 rounded-xl glass-gold flex items-center justify-center text-gold group-hover:scale-110 group-hover:rotate-6 transition-transform"
                  [innerHTML]="pillar.icon"
                ></div>
                <div>
                  <h4 class="font-display text-xl text-offwhite mb-1">
                    {{ pillar.title }}
                  </h4>
                  <p class="text-xs text-offwhite/55 leading-relaxed">
                    {{ pillar.desc }}
                  </p>
                </div>
              </li>
            }
          </ul>

          <!-- Counters -->
          <div
            class="grid grid-cols-3 gap-4 glass-strong rounded-2xl p-6"
          >
            <div class="text-center">
              <div
                class="font-display text-4xl md:text-5xl text-gold-gradient mb-1"
                [fbCounter]="500"
                suffix="+"
              >
                0+
              </div>
              <div class="text-[10px] tracking-[0.3em] uppercase text-offwhite/50">
                Evenimente
              </div>
            </div>
            <div class="text-center border-x border-white/5">
              <div
                class="font-display text-4xl md:text-5xl text-gold-gradient mb-1"
                [fbCounter]="1000"
                suffix="+"
              >
                0+
              </div>
              <div class="text-[10px] tracking-[0.3em] uppercase text-offwhite/50">
                Clienți
              </div>
            </div>
            <div class="text-center">
              <div
                class="font-display text-4xl md:text-5xl text-gold-gradient mb-1"
                [fbCounter]="5"
                suffix="+"
              >
                0+
              </div>
              <div class="text-[10px] tracking-[0.3em] uppercase text-offwhite/50">
                Ani
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class WhyUsComponent {
  protected readonly pillars: Pillar[] = [
    {
      title: 'Experiență profesională',
      desc: 'Ani de comenzi cinematografice și fluență editorială.',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-5 h-5"><circle cx="12" cy="8" r="5"/><path d="M8 14l-2 8 6-4 6 4-2-8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    },
    {
      title: 'Editare premium',
      desc: 'Culoare, ten și lumină — rafinate cadru cu cadru.',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-5 h-5"><path d="M4 20l12-12 4 4-12 12H4v-4z" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 6l4 4" stroke-linecap="round"/></svg>',
    },
    {
      title: 'Echipament de top',
      desc: 'Aparate profesionale, obiective prime și iluminat cinematografic.',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-5 h-5"><rect x="3" y="7" width="18" height="13" rx="2"/><circle cx="12" cy="13" r="4"/><path d="M9 7l1.5-3h3L15 7"/></svg>',
    },
    {
      title: 'Atmosferă relaxată',
      desc: 'Direcție calmă, astfel încât tu doar trăiești momentul.',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-5 h-5"><path d="M21 12a9 9 0 11-9-9" stroke-linecap="round"/><path d="M8 13s1.5 2 4 2 4-2 4-2" stroke-linecap="round"/></svg>',
    },
    {
      title: 'Stil natural',
      desc: 'Momente reale, lumină delicată, fără poze artificiale.',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-5 h-5"><path d="M12 2a7 7 0 00-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 00-7-7z" stroke-linejoin="round"/><circle cx="12" cy="9" r="2.5"/></svg>',
    },
    {
      title: 'Povești emoționante',
      desc: 'Fiecare cadru scris ca un paragraf din povestea ta.',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-5 h-5"><path d="M4 4h16v12H7l-3 4V4z" stroke-linejoin="round"/><path d="M8 9h8M8 12h5" stroke-linecap="round"/></svg>',
    },
  ];
}
