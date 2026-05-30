import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="relative mt-10 overflow-hidden bg-sage-700 text-cream-100">
      <div class="pointer-events-none absolute inset-0 opacity-[0.06]"
           style="background-image:radial-gradient(circle at 20% 20%, #fff 0, transparent 40%), radial-gradient(circle at 80% 60%, #fff 0, transparent 35%);"></div>

      <div class="container-x relative py-16 sm:py-20">
        <div class="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <!-- Brand -->
          <div class="lg:col-span-1">
            <img src="/logo-mare.png" alt="Mirtanis Events" class="h-14 w-auto" />
            <p class="mt-5 max-w-xs text-sm leading-relaxed text-cream-100/70">
              O locație de poveste pe malul lacului, unde fiecare nuntă, botez sau eveniment devine o amintire de neuitat.
            </p>
          </div>

          <!-- Nav -->
          <div>
            <h4 class="mb-4 text-xs uppercase tracking-widest2 text-gold-200">Navigare</h4>
            <ul class="space-y-3 text-sm text-cream-100/75">
              <li><a routerLink="/" class="transition-colors hover:text-gold-200">Acasă</a></li>
              <li><a routerLink="/locatii" class="transition-colors hover:text-gold-200">Locații</a></li>
              <li><a routerLink="/galerie" class="transition-colors hover:text-gold-200">Galerie</a></li>
              <li><a routerLink="/rezervari" class="transition-colors hover:text-gold-200">Rezervări</a></li>
              <li><a routerLink="/contact" class="transition-colors hover:text-gold-200">Contact</a></li>
            </ul>
          </div>

          <!-- Contact -->
          <div>
            <h4 class="mb-4 text-xs uppercase tracking-widest2 text-gold-200">Contact</h4>
            <ul class="space-y-3 text-sm text-cream-100/75">
              <li>Malul Lacului, România</li>
              <li><a href="tel:+407XXXXXXXX" class="transition-colors hover:text-gold-200">+40 7XX XXX XXX</a></li>
              <li><a href="mailto:contact@mirtanis.ro" class="transition-colors hover:text-gold-200">contact&#64;mirtanis.ro</a></li>
            </ul>
          </div>

          <!-- CTA -->
          <div>
            <h4 class="mb-4 text-xs uppercase tracking-widest2 text-gold-200">Plănuiește vizita</h4>
            <p class="mb-5 text-sm text-cream-100/70">Verifică disponibilitatea datei tale în câteva secunde.</p>
            <a routerLink="/rezervari" class="btn btn-gold w-full sm:w-auto">Verifică data</a>
          </div>
        </div>

        <div class="leaf-divider my-10 opacity-60">
          <span class="!bg-cream-100/30"></span>
          <span class="script text-2xl !text-gold-200">Mirtanis</span>
          <span class="!bg-cream-100/30"></span>
        </div>

        <div class="flex flex-col items-center justify-between gap-3 text-xs text-cream-100/50 sm:flex-row">
          <p>© {{ year }} Mirtanis Events. Toate drepturile rezervate.</p>
          <p>Creat cu grijă pentru momentele care contează.</p>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  readonly year = new Date().getFullYear();
}
