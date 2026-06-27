import {
  Component,
  ChangeDetectionStrategy,
  computed,
  inject,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, NgForm } from "@angular/forms";
import { firstValueFrom } from "rxjs";

import { ParticlesBgComponent } from "../../../../shared/components/particles-bg/particles-bg.component";
import { RevealOnScrollDirective } from "../../../../core/directives/reveal-on-scroll.directive";
import {
  BookingPayload,
  BookingService,
} from "../../../../core/services/booking.service";

interface ContactInfo {
  label: string;
  value: string;
  href?: string;
  icon: string;
}

interface CalendarCell {
  day: number | null;
  iso: string | null;
  isToday: boolean;
  isPast: boolean;
  isWeekend: boolean;
}

@Component({
  selector: "fb-contact",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ParticlesBgComponent,
    RevealOnScrollDirective,
  ],
  template: `
    <section
      id="contact"
      class="relative section-padding bg-primary overflow-hidden"
      aria-label="Contact"
    >
      <fb-particles-bg
        class="absolute inset-0 z-0 opacity-50"
        [particleCount]="35"
      ></fb-particles-bg>

      <div class="glow-orb glow-orb--gold w-[600px] h-[600px] -top-32 -left-32 opacity-25"></div>
      <div class="glow-orb glow-orb--purple w-[500px] h-[500px] -bottom-32 -right-32 opacity-20"></div>

      <div class="container-elegant relative">
        <!-- Header -->
        <div class="text-center mb-14" fbReveal="fade">
          <div class="inline-flex items-center gap-3 mb-5 text-[11px] tracking-[0.4em] uppercase text-gold/80">
            <span class="h-[1px] w-10 bg-gold/40"></span>
            <span>Hai să vorbim</span>
            <span class="h-[1px] w-10 bg-gold/40"></span>
          </div>
          <h2 class="text-display text-5xl md:text-6xl lg:text-7xl text-offwhite text-balance leading-[0.95]">
            Rezervă-ți ședința
            <em class="text-gold-gradient not-italic">foto</em>.
          </h2>
          <p class="mt-6 max-w-2xl mx-auto text-offwhite/60 leading-relaxed">
            Spune-ne despre ziua ta, viziunea ta, momentul tău — îți vom pregăti
            o ofertă personalizată pentru tine.
          </p>
        </div>

        <!-- Two-column layout: info | (calendar + form stacked) -->
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          <!-- LEFT: contact info -->
          <div class="lg:col-span-2 space-y-7" fbReveal="stagger">
            <div class="glass-strong rounded-2xl p-7">
              <h3 class="font-display text-2xl text-offwhite mb-5">Studioul</h3>
              <ul class="space-y-4">
                @for (info of contactInfo; track info.label) {
                  <li class="flex items-start gap-4 group">
                    <div
                      class="shrink-0 w-10 h-10 rounded-xl glass-gold flex items-center justify-center text-gold"
                      [innerHTML]="info.icon"
                    ></div>
                    <div class="flex-1 min-w-0">
                      <div class="text-[10px] tracking-[0.3em] uppercase text-offwhite/40 mb-1">
                        {{ info.label }}
                      </div>
                      @if (info.href) {
                        <a [href]="info.href" class="text-offwhite hover:text-gold transition-colors truncate block">{{ info.value }}</a>
                      } @else {
                        <span class="text-offwhite">{{ info.value }}</span>
                      }
                    </div>
                  </li>
                }
              </ul>

              <div class="flex items-center gap-3 mt-7 pt-5 border-t border-white/5">
                <a href="#" aria-label="Instagram"
                  class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-gold hover:text-gold transition-all">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-4 h-4">
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                  </svg>
                </a>
                <a href="https://wa.me/40722288986" aria-label="WhatsApp"
                  class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-gold hover:text-gold transition-all">
                  <svg viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
                    <path d="M17.5 14.4c-.3-.2-1.7-.8-2-.9-.3-.1-.5-.2-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.7-1.7-.9-2.3-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4 0 1.4 1 2.8 1.2 3 .1.2 2 3.1 4.9 4.4.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 2-1.3.2-.6.2-1.2.2-1.3-.1-.2-.3-.3-.6-.4zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 4.9L2 22l5.3-1.3C8.7 21.5 10.3 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2z"/>
                  </svg>
                </a>
                <a href="#" aria-label="Facebook"
                  class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-gold hover:text-gold transition-all">
                  <svg viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
                    <path d="M22 12a10 10 0 10-11.5 9.9V15H8v-3h2.5V9.8c0-2.5 1.5-3.8 3.7-3.8 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12H16l-.4 3h-2.1v6.9A10 10 0 0022 12z"/>
                  </svg>
                </a>
              </div>
            </div>

            <!-- Map (still left col, under info, balances vertical height) -->
            <div class="hidden lg:block rounded-2xl overflow-hidden border border-white/5 h-72">
              <iframe
                src="https://maps.google.com/maps?q=Strada+Stefan+cel+Mare+192,+Tecuci,+Galati,+Romania&t=&z=16&ie=UTF8&iwloc=&output=embed"
                class="w-full h-full filter grayscale brightness-75 contrast-110 hover:grayscale-0 transition-all duration-1000"
                title="Foto Bugeac — Str. Ștefan cel Mare 192, Tecuci"
                loading="lazy"
                referrerpolicy="no-referrer"
              ></iframe>
            </div>
          </div>

          <!-- RIGHT: calendar above form -->
          <div class="lg:col-span-3 space-y-6 relative" fbReveal="fade">
            <!-- ============== CALENDAR ABOVE ============== -->
            <div class="booking-calendar glass-strong rounded-2xl p-6">
              <div class="calendar-inner mx-auto">
                <div class="flex items-center justify-between mb-1">
                  <div>
                    <div class="text-[9px] tracking-[0.3em] uppercase text-gold/70 mb-0.5">
                      Alege o dată pentru ședință
                    </div>
                    <h3 class="font-display text-lg text-offwhite capitalize">
                      {{ monthName() }}
                    </h3>
                  </div>
                  <div class="flex gap-1">
                    <button type="button" (click)="changeMonth(-1)" [disabled]="monthOffset() === 0"
                      aria-label="Luna anterioară" class="cal-arrow">‹</button>
                    <button type="button" (click)="changeMonth(1)" aria-label="Luna următoare" class="cal-arrow">›</button>
                  </div>
                </div>

                <div class="grid grid-cols-7 gap-1 mt-4 mb-1 text-center">
                  @for (d of weekDays; track $index) {
                    <span class="text-[9px] tracking-widest uppercase text-offwhite/35 py-1">{{ d }}</span>
                  }
                </div>

                <div class="grid grid-cols-7 gap-1 text-center">
                  @for (cell of calendar(); track $index) {
                    <button
                      type="button"
                      [disabled]="!cell.day || cell.isPast"
                      (click)="selectDay(cell)"
                      class="cal-cell"
                      [class.cal-cell--empty]="!cell.day"
                      [class.cal-cell--past]="cell.isPast"
                      [class.cal-cell--weekend]="cell.isWeekend && cell.day && !cell.isPast"
                      [class.cal-cell--today]="cell.isToday"
                      [class.cal-cell--selected]="cell.iso && cell.iso === selectedIso()"
                    >{{ cell.day || "" }}</button>
                  }
                </div>

                @if (selectedIso()) {
                  <div class="mt-4 flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-gold/8 border border-gold/25">
                    <span class="text-gold text-lg leading-none">✦</span>
                    <div class="flex-1 min-w-0">
                      <div class="text-[9px] tracking-[0.3em] uppercase text-gold/80">
                        Dată selectată
                      </div>
                      <div class="text-offwhite text-xs font-medium capitalize">
                        {{ formatSelectedDate() }}
                      </div>
                    </div>
                    <button type="button" (click)="clearSelection()"
                      aria-label="Anulează selecția"
                      class="text-offwhite/40 hover:text-gold transition-colors text-xs">✕</button>
                  </div>
                } @else {
                  <p class="mt-4 text-[10.5px] text-offwhite/45 leading-relaxed">
                    Selectează ziua preferată — îți confirmăm disponibilitatea
                    într-un mesaj personal. Câmpul e opțional.
                  </p>
                }
              </div>
            </div>

            <!-- ============== FORM ============== -->
            <form
              #f="ngForm"
              novalidate
              (submit)="submit(f, $event)"
              class="glass-strong rounded-2xl p-7 md:p-10 space-y-6 relative"
            >
              @if (sent()) {
                <div class="absolute inset-0 z-10 rounded-2xl bg-primary/95 backdrop-blur-md flex flex-col items-center justify-center text-center p-10 animate-fade-in">
                  <div class="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mb-6 sent-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#D4AF37" stroke-width="2" class="w-10 h-10">
                      <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  <div class="text-[11px] tracking-[0.4em] uppercase text-gold mb-3">Trimis</div>
                  <h3 class="font-display text-3xl text-offwhite mb-3">
                    Mulțumim, {{ submittedName() || "frumos" }}.
                  </h3>
                  <p class="text-offwhite/60 max-w-sm">
                    Mesajul tău e în inbox-ul studioului. Îți vom răspunde
                    personal în maxim 24 de ore.
                  </p>
                  <button type="button" (click)="reset()"
                    class="mt-7 text-xs tracking-[0.25em] uppercase text-gold hover-underline">
                    Trimite altă cerere
                  </button>
                </div>
              }

              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <!-- Name -->
                <label class="floating-field">
                  <input
                    type="text" name="name"
                    [(ngModel)]="form.name" #nameField="ngModel"
                    required minlength="2"
                    placeholder=" "
                    class="floating-input"
                    [class.is-invalid]="shouldShow(nameField)"
                  />
                  <span class="floating-label">Nume complet</span>
                  @if (shouldShow(nameField)) {
                    <div class="field-error">
                      @if (nameField.errors?.['required']) {
                        Numele este obligatoriu.
                      } @else if (nameField.errors?.['minlength']) {
                        Numele trebuie să aibă cel puțin 2 caractere.
                      }
                    </div>
                  }
                </label>

                <!-- Email -->
                <label class="floating-field">
                  <input
                    type="email" name="email"
                    [(ngModel)]="form.email" #emailField="ngModel"
                    required email
                    placeholder=" "
                    class="floating-input"
                    [class.is-invalid]="shouldShow(emailField)"
                  />
                  <span class="floating-label">Email</span>
                  @if (shouldShow(emailField)) {
                    <div class="field-error">
                      @if (emailField.errors?.['required']) {
                        Adresa de email este obligatorie.
                      } @else if (emailField.errors?.['email']) {
                        Format de email invalid (ex: nume&#64;domeniu.ro).
                      }
                    </div>
                  }
                </label>

                <!-- Phone -->
                <label class="floating-field">
                  <input
                    type="tel" name="phone"
                    [(ngModel)]="form.phone" #phoneField="ngModel"
                    pattern="^[0-9+()\\s-]{6,20}$"
                    placeholder=" "
                    class="floating-input"
                    [class.is-invalid]="shouldShow(phoneField)"
                  />
                  <span class="floating-label">Telefon (opțional)</span>
                  @if (shouldShow(phoneField)) {
                    <div class="field-error">
                      Format invalid. Folosește doar cifre, spații, +, ( ) sau -.
                    </div>
                  }
                </label>

                <!-- Service -->
                <label class="floating-field">
                  <select
                    name="service"
                    [(ngModel)]="form.service" #serviceField="ngModel"
                    required
                    class="floating-input appearance-none"
                    [class.is-invalid]="shouldShow(serviceField)"
                  >
                    <option value="" disabled selected hidden></option>
                    <option value="wedding">Nuntă</option>
                    <option value="baptism">Botez</option>
                    <option value="event">Eveniment / Petrecere</option>
                    <option value="studio">Ședință Studio</option>
                    <option value="fashion">Fashion / Editorial</option>
                    <option value="other">Altul</option>
                  </select>
                  <span class="floating-label">Serviciu</span>
                  @if (shouldShow(serviceField)) {
                    <div class="field-error">
                      Te rugăm să selectezi un serviciu.
                    </div>
                  }
                </label>
              </div>

              <!-- Message -->
              <label class="floating-field block">
                <textarea
                  name="message" rows="5"
                  [(ngModel)]="form.message" #messageField="ngModel"
                  required minlength="10"
                  placeholder=" "
                  class="floating-input resize-none"
                  [class.is-invalid]="shouldShow(messageField)"
                ></textarea>
                <span class="floating-label">Spune-ne despre momentul tău…</span>
                @if (shouldShow(messageField)) {
                  <div class="field-error">
                    @if (messageField.errors?.['required']) {
                      Mesajul este obligatoriu.
                    } @else if (messageField.errors?.['minlength']) {
                      Te rugăm să scrii cel puțin 10 caractere
                      ({{ messageField.errors?.['minlength']?.actualLength }}/10 acum).
                    }
                  </div>
                }
              </label>

              <!-- Selected date echo (links calendar with form) -->
              @if (selectedIso()) {
                <div class="flex items-start gap-3 px-4 py-3 rounded-xl bg-gold/8 border border-gold/25">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#D4AF37" stroke-width="1.5" class="w-5 h-5 shrink-0 mt-0.5">
                    <rect x="3" y="5" width="18" height="16" rx="2"/>
                    <path d="M3 10h18M8 3v4M16 3v4" stroke-linecap="round"/>
                  </svg>
                  <div class="flex-1 min-w-0">
                    <div class="text-[10px] tracking-[0.3em] uppercase text-gold/80 mb-0.5">
                      Dată propusă (din calendar)
                    </div>
                    <div class="text-sm text-offwhite capitalize">
                      {{ formatSelectedDate() }}
                    </div>
                  </div>
                  <button type="button" (click)="clearSelection()"
                    class="text-offwhite/40 hover:text-gold transition-colors text-xs shrink-0"
                    aria-label="Elimină data">✕</button>
                </div>
              }

              @if (errorMessage()) {
                <div class="flex items-start gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm" role="alert">
                  <span class="text-base">⚠</span>
                  <span class="flex-1">{{ errorMessage() }}</span>
                </div>
              }

              <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <p class="text-xs text-offwhite/40 max-w-sm">
                  Prin trimitere, ești de acord să fii contactat(ă) de studioul
                  nostru. Nu împărtășim informațiile tale.
                </p>
                <button
                  type="submit"
                  [class.is-blocked]="!sending() && f.invalid"
                  [class.is-loading]="sending()"
                  class="btn-primary whitespace-nowrap"
                >
                  @if (sending()) {
                    <span class="inline-block w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin mr-2"></span>
                    Se trimite…
                  } @else {
                    Trimite Mesajul
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-4 h-4 ml-1">
                      <path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" />
                    </svg>
                  }
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Mobile-only map (the lg copy lives inside the left column) -->
        <div class="lg:hidden mt-7 rounded-2xl overflow-hidden border border-white/5 h-72">
          <iframe
            src="https://maps.google.com/maps?q=Strada+Stefan+cel+Mare+192,+Tecuci,+Galati,+Romania&t=&z=16&ie=UTF8&iwloc=&output=embed"
            class="w-full h-full filter grayscale brightness-75 contrast-110 hover:grayscale-0 transition-all duration-1000"
            title="Foto Bugeac — Str. Ștefan cel Mare 192, Tecuci"
            loading="lazy"
            referrerpolicy="no-referrer"
          ></iframe>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      /* ============ Floating-label form fields ============ */
      .floating-field {
        position: relative;
        display: block;
      }
      .floating-input {
        width: 100%;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 0.75rem;
        padding: 1.25rem 1rem 0.5rem;
        color: #f8f8f8;
        font-size: 0.95rem;
        transition:
          border-color 0.35s,
          background 0.35s,
          box-shadow 0.35s;
      }
      .floating-input:focus {
        outline: none;
        border-color: rgba(212, 175, 55, 0.5);
        background: rgba(212, 175, 55, 0.04);
        box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
      }
      .floating-input.is-invalid {
        border-color: rgba(239, 68, 68, 0.55);
        background: rgba(239, 68, 68, 0.04);
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.08);
        animation: shake 0.45s cubic-bezier(0.36, 0.07, 0.19, 0.97);
      }
      @keyframes shake {
        10%, 90% { transform: translateX(-1px); }
        20%, 80% { transform: translateX(2px); }
        30%, 50%, 70% { transform: translateX(-3px); }
        40%, 60% { transform: translateX(3px); }
      }
      .floating-label {
        position: absolute;
        top: 1.1rem;
        left: 1rem;
        font-size: 0.85rem;
        color: rgba(248, 248, 248, 0.5);
        pointer-events: none;
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        background: transparent;
      }
      .floating-input:focus + .floating-label,
      .floating-input:not(:placeholder-shown) + .floating-label {
        top: 0.4rem;
        font-size: 0.65rem;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: #d4af37;
      }
      .floating-input.is-invalid:focus + .floating-label,
      .floating-input.is-invalid:not(:placeholder-shown) + .floating-label {
        color: rgba(239, 68, 68, 0.85);
      }
      .floating-input option {
        background: #121218;
        color: #f8f8f8;
      }

      /* Inline error messages */
      .field-error {
        display: flex;
        align-items: flex-start;
        gap: 0.4rem;
        margin-top: 0.5rem;
        padding-left: 0.25rem;
        color: rgba(252, 165, 165, 0.95);
        font-family: 'Inter', sans-serif;
        font-size: 0.72rem;
        line-height: 1.4;
        letter-spacing: 0.01em;
        animation: errorIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .field-error::before {
        content: '⚠';
        flex-shrink: 0;
        color: rgba(239, 68, 68, 0.8);
      }
      @keyframes errorIn {
        from { opacity: 0; transform: translateY(-4px); }
        to { opacity: 1; transform: translateY(0); }
      }

      /* Submit button states */
      .btn-primary.is-blocked {
        opacity: 0.55;
        filter: saturate(0.6);
        cursor: not-allowed;
      }
      .btn-primary.is-loading {
        opacity: 0.85;
        cursor: progress;
      }

      /* ============ Calendar ============ */
      .calendar-inner {
        max-width: 360px;
      }

      .cal-arrow {
        width: 1.75rem;
        height: 1.75rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 9999px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: rgba(248, 248, 248, 0.75);
        font-size: 1rem;
        line-height: 1;
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .cal-arrow:hover:not(:disabled) {
        border-color: rgba(212, 175, 55, 0.7);
        color: #d4af37;
      }
      .cal-arrow:disabled {
        opacity: 0.35;
        cursor: not-allowed;
      }

      .cal-cell {
        aspect-ratio: 1 / 1;
        max-width: 44px;
        margin-inline: auto;
        width: 100%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-family: 'Inter', sans-serif;
        font-size: 0.75rem;
        font-weight: 500;
        color: rgba(248, 248, 248, 0.85);
        background: transparent;
        border: 1px solid rgba(255, 255, 255, 0.04);
        border-radius: 0.5rem;
        transition:
          color 0.25s,
          background 0.35s cubic-bezier(0.16, 1, 0.3, 1),
          border-color 0.3s,
          transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
          box-shadow 0.35s;
        cursor: pointer;
      }
      .cal-cell:hover:not(:disabled) {
        border-color: rgba(212, 175, 55, 0.55);
        color: #f7e7ce;
        transform: translateY(-1px);
      }

      .cal-cell--empty {
        visibility: hidden;
        cursor: default;
      }
      .cal-cell--past {
        color: rgba(248, 248, 248, 0.2);
        cursor: not-allowed;
        text-decoration: line-through;
        background: transparent;
      }
      .cal-cell--past:hover {
        transform: none;
        border-color: rgba(255, 255, 255, 0.04);
        color: rgba(248, 248, 248, 0.2);
      }
      .cal-cell--weekend {
        color: rgba(212, 175, 55, 0.7);
      }
      .cal-cell--today {
        border-color: rgba(212, 175, 55, 0.5);
        background: rgba(212, 175, 55, 0.05);
      }
      .cal-cell--selected,
      .cal-cell--selected:hover {
        background: linear-gradient(135deg, #d4af37, #f7e7ce);
        color: #0b0b0f;
        border-color: transparent;
        box-shadow: 0 6px 20px -6px rgba(212, 175, 55, 0.65);
        transform: translateY(-1px);
      }

      /* Sent icon spring */
      .sent-icon {
        animation: pop 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
      }
      @keyframes pop {
        0% { transform: scale(0.4); opacity: 0; }
        60% { transform: scale(1.1); opacity: 1; }
        100% { transform: scale(1); opacity: 1; }
      }
    `,
  ],
})
export class ContactComponent {
  private readonly bookingSvc = inject(BookingService);

  protected readonly sent = signal(false);
  protected readonly sending = signal(false);
  protected readonly submitAttempted = signal(false);
  protected readonly errorMessage = signal<string>('');
  protected readonly submittedName = signal<string>('');

  protected readonly selectedIso = signal<string | null>(null);
  protected readonly monthOffset = signal(0);

  protected form: {
    name: string;
    email: string;
    phone: string;
    service: BookingPayload['service'] | '';
    message: string;
  } = {
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  };

  protected readonly contactInfo: ContactInfo[] = [
    {
      label: 'Email',
      value: 'fotobugeac92@yahoo.com',
      href: 'mailto:fotobugeac92@yahoo.com',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-4 h-4"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6" stroke-linecap="round"/></svg>',
    },
    {
      label: 'Alina (principal)',
      value: '0722 288 986',
      href: 'tel:+40722288986',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-4 h-4"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.9 19.9 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.9 19.9 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    },
    {
      label: 'Ionuț',
      value: '0761 525 653',
      href: 'tel:+40761525653',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-4 h-4"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.9 19.9 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.9 19.9 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    },
    {
      label: 'WhatsApp',
      value: 'Discută cu studioul',
      href: 'https://wa.me/40722288986',
      icon: '<svg viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4"><path d="M17.5 14.4c-.3-.2-1.7-.8-2-.9-.3-.1-.5-.2-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.7-1.7-.9-2.3-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4 0 1.4 1 2.8 1.2 3 .1.2 2 3.1 4.9 4.4.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 2-1.3.2-.6.2-1.2.2-1.3-.1-.2-.3-.3-.6-.4z"/></svg>',
    },
    {
      label: 'Studio',
      value: 'Str. Ștefan cel Mare nr. 192, Tecuci, Galați',
      href: 'https://maps.google.com/?q=Strada+Stefan+cel+Mare+192,+Tecuci,+Galati,+Romania',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-4 h-4"><path d="M12 22s8-7.5 8-13a8 8 0 10-16 0c0 5.5 8 13 8 13z" stroke-linejoin="round"/><circle cx="12" cy="9" r="3"/></svg>',
    },
    {
      label: 'Program',
      value: 'Luni – Vineri · 10:00 – 18:00',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-4 h-4"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    },
  ];

  protected readonly weekDays = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

  protected readonly monthName = computed(() => {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() + this.monthOffset());
    return d.toLocaleString('ro-RO', { month: 'long', year: 'numeric' });
  });

  protected readonly calendar = computed<CalendarCell[]>(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const target = new Date(
      now.getFullYear(),
      now.getMonth() + this.monthOffset(),
      1,
    );

    const firstWeekDay = (target.getDay() + 6) % 7;
    const lastDate = new Date(
      target.getFullYear(),
      target.getMonth() + 1,
      0,
    ).getDate();

    const cells: CalendarCell[] = [];
    for (let i = 0; i < firstWeekDay; i++) {
      cells.push({ day: null, iso: null, isToday: false, isPast: false, isWeekend: false });
    }
    for (let d = 1; d <= lastDate; d++) {
      const date = new Date(target.getFullYear(), target.getMonth(), d);
      const dow = date.getDay();
      cells.push({
        day: d,
        iso: this.toIso(date),
        isToday: date.getTime() === today.getTime(),
        isPast: date.getTime() < today.getTime(),
        isWeekend: dow === 0 || dow === 6,
      });
    }
    return cells;
  });

  // -- helpers --
  private toIso(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  protected formatSelectedDate(): string {
    const iso = this.selectedIso();
    if (!iso) return '';
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('ro-RO', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  /** Show the inline error for a field when it's invalid AND user has interacted or submitted. */
  protected shouldShow(
    field: {
      invalid?: boolean | null;
      touched?: boolean | null;
      dirty?: boolean | null;
    } | null,
  ): boolean {
    if (!field) return false;
    if (!field.invalid) return false;
    return Boolean(field.touched || field.dirty || this.submitAttempted());
  }

  // -- calendar --
  protected changeMonth(delta: number): void {
    this.monthOffset.update((v) => Math.max(0, v + delta));
  }
  protected selectDay(cell: CalendarCell): void {
    if (!cell.iso || cell.isPast) return;
    this.selectedIso.set(cell.iso);
  }
  protected clearSelection(): void {
    this.selectedIso.set(null);
  }

  // -- submit --
  protected async submit(form: NgForm, e: Event): Promise<void> {
    e.preventDefault();
    if (this.sending()) return;

    // Always mark "submit attempted" so every error appears, even if the
    // user clicks the button without ever touching the fields.
    this.submitAttempted.set(true);
    this.markAllTouched(form);

    if (form.invalid) {
      // Scroll the first invalid field into view for nicer UX.
      this.focusFirstInvalid();
      return;
    }

    this.errorMessage.set('');
    this.sending.set(true);

    const payload: BookingPayload = {
      name: this.form.name.trim(),
      email: this.form.email.trim(),
      phone: this.form.phone?.trim() || null,
      service: this.form.service as BookingPayload['service'],
      message: this.form.message.trim(),
      preferred_date: this.selectedIso()
        ? new Date(this.selectedIso() + 'T12:00:00').toISOString()
        : null,
    };

    try {
      const res = await firstValueFrom(this.bookingSvc.send(payload));
      if (res?.ok) {
        this.submittedName.set(payload.name.split(' ')[0] || '');
        this.sent.set(true);
      } else {
        this.errorMessage.set(res?.message || 'Trimiterea a eșuat. Te rugăm reîncearcă.');
      }
    } catch (err: unknown) {
      const e = err as { error?: { detail?: unknown }; status?: number };
      const detail = e?.error?.detail;
      if (e?.status === 0) {
        this.errorMessage.set('Nu mă pot conecta la server. Verifică internetul sau încearcă din nou.');
      } else if (typeof detail === 'string') {
        this.errorMessage.set(detail);
      } else if (Array.isArray(detail)) {
        this.errorMessage.set(
          detail.map((it: { msg?: string }) => it?.msg || 'invalid').join(' · '),
        );
      } else {
        this.errorMessage.set('Trimiterea a eșuat. Te rugăm reîncearcă.');
      }
    } finally {
      this.sending.set(false);
    }
  }

  private markAllTouched(form: NgForm): void {
    Object.values(form.controls).forEach((c) => {
      c.markAsTouched();
      c.markAsDirty();
      c.updateValueAndValidity({ emitEvent: false });
    });
  }

  private focusFirstInvalid(): void {
    setTimeout(() => {
      const el = document.querySelector('.floating-input.is-invalid') as HTMLElement | null;
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.focus({ preventScroll: true });
      }
    }, 50);
  }

  protected reset(): void {
    this.sent.set(false);
    this.sending.set(false);
    this.submitAttempted.set(false);
    this.errorMessage.set('');
    this.submittedName.set('');
    this.selectedIso.set(null);
    this.form = { name: '', email: '', phone: '', service: '', message: '' };
  }
}
