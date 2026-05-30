import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../../shared/directives/reveal.directive';

@Component({
  selector: 'app-cta-section',
  standalone: true,
  imports: [CommonModule, RouterLink, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section relative overflow-hidden">
      <div class="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=2000&q=80"
             alt="Cort premium" class="w-full h-full object-cover" loading="lazy"/>
        <div class="absolute inset-0 bg-ink-950/80"></div>
        <div class="absolute inset-0 bg-lux-radial"></div>
      </div>
      <div class="container-luxe relative z-10 text-center max-w-3xl">
        <span appReveal class="eyebrow">Începem povestea ta?</span>
        <h2 appReveal [revealDelay]="100" class="mt-5 font-display text-5xl md:text-7xl text-white leading-[1]">
          Programează o <span class="gold-text">vizită privată</span>.
        </h2>
        <p appReveal [revealDelay]="200" class="mt-7 text-white/75 text-lg leading-relaxed">
          Vino să descoperi locația în liniște, alături de echipa noastră. Îți arătăm cortul,
          sala, pontoanele și răspundem la toate întrebările tale.
        </p>
        <div appReveal [revealDelay]="300" class="mt-10 flex flex-wrap justify-center gap-4">
          <a routerLink="/rezervari" class="btn btn-primary">Verifică disponibilitatea</a>
          <a routerLink="/contact" class="btn btn-ghost">Trimite mesaj</a>
        </div>
      </div>
    </section>
  `
})
export class CtaSectionComponent {}
