import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-footer",
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="relative overflow-hidden bg-sage-700 text-cream-100">
      <div
        class="pointer-events-none absolute inset-0 opacity-[0.06]"
        style="background-image:radial-gradient(circle at 20% 20%, #fff 0, transparent 40%), radial-gradient(circle at 80% 60%, #fff 0, transparent 35%);"
      ></div>

      <div class="container-x relative py-12 sm:py-16 lg:py-20">
        <div class="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <!-- Brand -->
          <div class="lg:col-span-1">
            <img
              src="/logo-mic-color.png"
              alt="Mirtanis Events"
              class="h-11 w-auto sm:h-14"
            />
            <p class="mt-4 max-w-xs text-sm leading-relaxed text-cream-100/70">
              O locație de poveste pe malul lacului, unde fiecare eveniment
              devine o amintire de neuitat.
            </p>
          </div>

          <!-- Nav + Contact: two columns on mobile -->
          <div class="grid grid-cols-2 gap-8 md:col-span-2 lg:contents">
            <div>
              <h4 class="mb-3 text-xs uppercase tracking-widest2 text-gold-200">
                Navigare
              </h4>
              <ul class="space-y-2.5 text-sm text-cream-100/75">
                <li>
                  <a
                    routerLink="/"
                    class="transition-colors hover:text-gold-200"
                    >Acasă</a
                  >
                </li>
                <li>
                  <a
                    routerLink="/locatii"
                    class="transition-colors hover:text-gold-200"
                    >Locații</a
                  >
                </li>
                <li>
                  <a
                    routerLink="/galerie"
                    class="transition-colors hover:text-gold-200"
                    >Galerie</a
                  >
                </li>
                <li>
                  <a
                    routerLink="/contact"
                    class="transition-colors hover:text-gold-200"
                    >Contact</a
                  >
                </li>
              </ul>
            </div>

            <div>
              <h4 class="mb-3 text-xs uppercase tracking-widest2 text-gold-200">
                Contact
              </h4>
              <ul class="space-y-2.5 text-sm text-cream-100/75">
                <li>Barcea, Galați · Mihai Eminescu 37</li>
                <li>
                  <a
                    href="tel:+40767690552"
                    class="transition-colors hover:text-gold-200"
                    >+40 767 690 552</a
                  >
                </li>
                <li>
                  <a
                    href="mailto:contact@mirtanisevents.ro"
                    class="break-all transition-colors hover:text-gold-200"
                    >contact&#64;mirtanisevents.ro</a
                  >
                </li>
              </ul>
            </div>
          </div>

          <!-- CTA -->
          <div>
            <h4 class="mb-3 text-xs uppercase tracking-widest2 text-gold-200">
              Plănuiește vizita
            </h4>
            <p class="mb-4 text-sm text-cream-100/70">
              Verifică disponibilitatea datei tale în câteva secunde.
            </p>
            <a routerLink="/contact" class="btn btn-gold w-full sm:w-auto"
              >Verifică data</a
            >
          </div>
        </div>

        <div
          class="mt-10 flex flex-col items-center gap-2 border-t border-cream-100/15 pt-6 text-center text-xs text-cream-100/50 sm:flex-row sm:justify-between sm:text-left"
        >
          <p>© {{ year }} Mirtanis Events. Toate drepturile rezervate.</p>
          <p>Creat cu grijă pentru momentele care contează.</p>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  readonly year = new Date().getFullYear();
}
