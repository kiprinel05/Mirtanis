import { Component, ChangeDetectionStrategy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RevealOnScrollDirective } from "../../../../core/directives/reveal-on-scroll.directive";

interface FacebookPost {
  src: string;
  /** Link to the Facebook post — placeholder until the user supplies them. */
  href: string;
  alt: string;
}

@Component({
  selector: "fb-facebook",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RevealOnScrollDirective],
  template: `
    <section
      class="relative section-padding bg-secondary overflow-hidden"
      aria-label="Cele mai recente postări de pe Facebook"
    >
      <div class="container-elegant relative">
        <div
          class="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-10"
          fbReveal="fade"
        >
          <div>
            <div
              class="inline-flex items-center gap-3 mb-4 text-[11px] tracking-[0.4em] uppercase text-gold/80"
            >
              <span class="h-[1px] w-10 bg-gold/40"></span>
              <span>Facebook</span>
            </div>
            <h2
              class="text-display text-4xl md:text-5xl text-offwhite leading-[1.05]"
            >
              Foto Bugeac
            </h2>
            <p class="mt-3 text-sm text-offwhite/55 max-w-md">
              Cele mai recente postări de pe pagina noastră — apasă pe orice
              imagine pentru a deschide postarea originală.
            </p>
          </div>
          <a
            href="https://www.facebook.com/alinabugeac92"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center gap-2 hover-underline text-gold text-sm tracking-[0.2em] uppercase"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
              <path
                d="M22 12a10 10 0 10-11.5 9.9V15H8v-3h2.5V9.8c0-2.5 1.5-3.8 3.7-3.8 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12H16l-.4 3h-2.1v6.9A10 10 0 0022 12z"
              />
            </svg>
            Urmărește-ne →
          </a>
        </div>

        <div
          class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-3"
          fbReveal="stagger"
        >
          @for (post of posts; track post.src) {
            <a
              [href]="post.href"
              target="_blank"
              rel="noopener"
              class="group relative aspect-square overflow-hidden rounded-xl"
              [attr.aria-label]="post.alt"
            >
              <img
                [src]="post.src"
                [alt]="post.alt"
                loading="lazy"
                class="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-110"
              />
              <div
                class="absolute inset-0 bg-primary/0 group-hover:bg-primary/65 transition-colors duration-500 flex items-center justify-center"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="w-8 h-8 text-gold opacity-0 group-hover:opacity-100 transition-all scale-50 group-hover:scale-100 duration-500"
                >
                  <path
                    d="M22 12a10 10 0 10-11.5 9.9V15H8v-3h2.5V9.8c0-2.5 1.5-3.8 3.7-3.8 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12H16l-.4 3h-2.1v6.9A10 10 0 0022 12z"
                  />
                </svg>
              </div>
            </a>
          }
        </div>
      </div>
    </section>
  `,
})
export class FacebookComponent {
  /**
   * Postările afișate. Imagini din `assets/facebook/`, link-uri momentan
   * placeholder (#) — completează `href` cu URL-ul real al postării.
   */
  protected readonly posts: FacebookPost[] = [
    {
      src: "assets/facebook/p-1.jpg",
      href: "https://www.facebook.com/photo?fbid=1582314463898854",
      alt: "Postare Facebook 1",
    },
    {
      src: "assets/facebook/p-2.jpg",
      href: "https://www.facebook.com/photo?fbid=1581377813992519",
      alt: "Postare Facebook 2",
    },
    {
      src: "assets/facebook/p-3.jpg",
      href: "https://www.facebook.com/photo?fbid=1525072642956370",
      alt: "Postare Facebook 3",
    },
    {
      src: "assets/facebook/p-4.jpg",
      href: "https://www.facebook.com/photo?fbid=1524037686393199",
      alt: "Postare Facebook 4",
    },
    {
      src: "assets/facebook/p-5.jpg",
      href: "https://www.facebook.com/photo?fbid=1523147083148926",
      alt: "Postare Facebook 5",
    },
    {
      src: "assets/facebook/p-6.jpg",
      href: "https://www.facebook.com/photo?fbid=1523101056486862",
      alt: "Postare Facebook 6",
    },
    {
      src: "assets/facebook/p-7.jpg",
      href: "https://www.facebook.com/photo?fbid=1387127150084254",
      alt: "Postare Facebook 7",
    },
    {
      src: "assets/facebook/p-8.jpg",
      href: "https://www.facebook.com/photo?fbid=1128821345914837",
      alt: "Postare Facebook 8",
    },
    {
      src: "assets/facebook/p-9.jpg",
      href: "https://www.facebook.com/photo?fbid=1079673264162979",
      alt: "Postare Facebook 9",
    },
    {
      src: "assets/facebook/p-10.jpg",
      href: "https://www.facebook.com/photo?fbid=1077171081079864",
      alt: "Postare Facebook 10",
    },
  ];
}
