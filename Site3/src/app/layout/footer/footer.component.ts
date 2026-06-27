import { Component, ChangeDetectionStrategy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RevealOnScrollDirective } from "../../core/directives/reveal-on-scroll.directive";

@Component({
  selector: "fb-footer",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RevealOnScrollDirective],
  template: `
    <footer
      class="relative overflow-hidden bg-secondary text-offwhite/80 pt-24 pb-10 px-6 lg:px-10 mt-20"
    >
      <!-- Ambient orbs -->
      <div
        class="glow-orb glow-orb--gold w-[600px] h-[600px] -top-64 -right-64 opacity-30"
      ></div>
      <div
        class="glow-orb glow-orb--purple w-[500px] h-[500px] -bottom-32 -left-32 opacity-20"
      ></div>

      <div
        class="container-elegant relative grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-10"
        fbReveal="stagger"
      >
        <!-- Brand -->
        <div>
          <img
            src="assets/logo/logo-mare.png"
            alt="Foto Bugeac — Studio Cinematografic"
            class="h-16 md:h-20 w-auto mb-6"
          />
          <p class="text-sm leading-relaxed text-offwhite/60 max-w-xs">
            Transformăm momentele în amintiri eterne. Fotografie cinematografică
            realizată cu emoție, măiestrie și grijă pentru fiecare detaliu.
          </p>
        </div>

        <!-- Navigation -->
        <div>
          <h4 class="font-display text-lg text-gold mb-5 tracking-wide">
            Explorează
          </h4>
          <ul class="space-y-3 text-sm">
            <li><a href="#services" class="hover-underline">Servicii</a></li>
            <li><a href="#portfolio" class="hover-underline">Portofoliu</a></li>
            <li><a href="#why" class="hover-underline">Studio</a></li>
            <li>
              <a href="#testimonials" class="hover-underline">Testimoniale</a>
            </li>
            <li><a href="#blog" class="hover-underline">Jurnal</a></li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h4 class="font-display text-lg text-gold mb-5 tracking-wide">
            Contact
          </h4>
          <ul class="space-y-3 text-sm">
            <li class="flex items-center gap-2">
              <span class="text-gold">✦</span>
              <a href="mailto:fotobugeac92@yahoo.com" class="hover-underline"
                >fotobugeac92&#64;yahoo.com</a
              >
            </li>
            <li class="flex items-center gap-2">
              <span class="text-gold">✦</span>
              <a href="tel:+40722288986" class="hover-underline"
                >0722 288 986 · Alina</a
              >
            </li>
            <li class="flex items-center gap-2">
              <span class="text-gold">✦</span>
              <a href="tel:+40761525653" class="hover-underline"
                >0761 525 653 · Ionuț</a
              >
            </li>
            <li class="flex items-start gap-2">
              <span class="text-gold mt-1">✦</span>
              <a
                href="https://maps.google.com/?q=Strada+Stefan+cel+Mare+192,+Tecuci,+Galati,+Romania"
                target="_blank"
                rel="noopener"
                class="hover-underline"
                >Str. Ștefan cel Mare 192, Tecuci, Galați</a
              >
            </li>
            <li class="flex items-center gap-2">
              <span class="text-gold">✦</span>
              <span>Luni – Vineri · 10:00 – 18:00</span>
            </li>
          </ul>

          <!-- Social -->
          <div class="flex items-center gap-3 mt-7">
            <a
              href="https://www.facebook.com/alinabugeac92"
              target="_blank"
              rel="noopener"
              aria-label="Facebook"
              class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-gold hover:text-gold hover:shadow-glow transition-all duration-500"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
                <path
                  d="M22 12a10 10 0 10-11.5 9.9V15H8v-3h2.5V9.8c0-2.5 1.5-3.8 3.7-3.8 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12H16l-.4 3h-2.1v6.9A10 10 0 0022 12z"
                />
              </svg>
            </a>

            <a
              href="https://wa.me/40722288986"
              target="_blank"
              rel="noopener"
              aria-label="WhatsApp"
              class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-gold hover:text-gold hover:shadow-glow transition-all duration-500"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
                <path
                  d="M17.5 14.4c-.3-.2-1.7-.8-2-.9-.3-.1-.5-.2-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.7-1.7-.9-2.3-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4 0 1.4 1 2.8 1.2 3 .1.2 2 3.1 4.9 4.4.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 2-1.3.2-.6.2-1.2.2-1.3-.1-.2-.3-.3-.6-.4zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 4.9L2 22l5.3-1.3C8.7 21.5 10.3 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2z"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div class="divider-gold mt-16 mb-8"></div>

      <div
        class="container-elegant relative flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-offwhite/40 font-body"
      >
        <p>© {{ year }} Foto Bugeac. Crafted with light & emotion.</p>
        <ul class="flex items-center gap-6">
          <li><a href="#" class="hover-underline">Privacy</a></li>
          <li><a href="#" class="hover-underline">Terms</a></li>
          <li><a href="#" class="hover-underline">Cookies</a></li>
        </ul>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  protected readonly year = new Date().getFullYear();
}
