# Foto Bugeac — Cinematic Photography Studio + Private Client Galleries

A fully modern, cinematic, ultra-premium photography studio website built with **Angular 17 (standalone components)**, **TypeScript**, **Tailwind CSS**, and a layered animation stack inspired by Awwwards, Apple storytelling, and luxury editorial sites — extended with a **private client delivery system** powered by **FastAPI** + **Cloudflare R2**.

> "Transformăm momentele în amintiri eterne."

The project now ships in two pieces:

1. **`src/`** — the presentation website (unchanged visually)
2. **`backend/`** — a FastAPI gallery API that handles event creation, image upload to Cloudflare R2, signed downloads, and per-event share links

Three new front-end routes plug into the existing app **without modifying the homepage**:

| URL                  | Audience       | What it does                                              |
| -------------------- | -------------- | --------------------------------------------------------- |
| `/`                  | Public         | The presentation site (unchanged)                         |
| `/gallery/:slug`     | Client (link)  | Private gallery, masonry, lightbox, favorites, downloads  |
| `/admin`             | Photographer   | Login + dashboard + per-event upload & link rotation      |

The shell (navbar, footer, floating CTA, custom cursor, loader) is **automatically hidden** on `/gallery/*` and `/admin/*` so the new sections feel like a dedicated app, while the homepage stays pixel-identical.

---

## ✨ Highlights

- **Cinematic hero** with cross-fading slideshow, Ken Burns motion, animated headline, mouse-follow gold glow, floating orbs, particles canvas, and animated scroll indicator
- **Premium glass navbar** that transitions from transparent to glassmorphism on scroll, with magnetic CTA, animated hover underlines, dark/light mode toggle, and a futuristic full-screen mobile menu
- **6 cinematic service cards** with 3D hover lift, animated gradient borders, glow effects, and an additional craft strip
- **Interactive masonry portfolio** with category filters, lazy-loaded images, hover reveal, and a fullscreen lightbox with keyboard-navigable gallery
- **Why Us split layout** with parallax image, floating frames, six craft pillars, and animated counters (500+ events · 1000+ clients · 5+ years)
- **Immersive parallax storytelling** section with quote, floating frames, and ambient glow
- **Glassmorphism testimonial carousel** with animated star ratings, autoplay, dots, and arrows
- **Before / After editing slider** (drag to reveal)
- **Animated FAQ accordion** with elegant grid-template-rows expansion
- **Editorial blog preview** with category badges, read time, and hover zoom
- **Instagram feed preview** grid
- **Split-screen contact** with floating-label form, in-house booking calendar UI, success animation, social/WhatsApp/phone, and an embedded map
- **Cinematic loading screen** with animated monogram and progress ring
- **Custom animated cursor** with magnetic hover state
- **Scroll progress bar** at the top of the viewport
- **Floating mobile CTA** for WhatsApp + call

### Built-in primitives
- Reveal-on-scroll directive
- Magnetic-hover directive
- Parallax directive
- Animated counter directive
- Theme service (signals + localStorage)
- Custom canvas particles component
- Smooth-scroll service

---

## 🎨 Design System

| Token            | Value       |
| ---------------- | ----------- |
| Primary BG       | `#0B0B0F`   |
| Secondary BG     | `#121218`   |
| Gold accent      | `#D4AF37`   |
| Champagne        | `#F7E7CE`   |
| Warm beige       | `#F5E6CA`   |
| Soft white       | `#F8F8F8`   |

**Typography**
- Headings: *Cormorant Garamond / Playfair Display*
- Body: *Inter*

**Cards**
```css
background: rgba(255, 255, 255, 0.05);
backdrop-filter: blur(14px);
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** ≥ 18.13
- **npm** ≥ 9

### Install
```bash
npm install
```

### Run dev server
```bash
npm start
```
Open [http://localhost:4200](http://localhost:4200).

### Production build
```bash
npm run build:prod
```
Output goes to `dist/foto-bugeac`.

---

## 🗂️ Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── services/         # theme, scroll, loader
│   │   └── directives/       # reveal, magnetic, parallax, counter
│   ├── shared/
│   │   └── components/       # cursor, loading-screen, particles, cta, scroll-progress
│   ├── layout/
│   │   ├── navbar/
│   │   └── footer/
│   ├── pages/
│   │   ├── home/             # composes all home sections
│   │   │   └── sections/
│   │   │       ├── hero/
│   │   │       ├── services/
│   │   │       ├── portfolio/
│   │   │       ├── why-us/
│   │   │       ├── storytelling/
│   │   │       ├── testimonials/
│   │   │       ├── before-after/
│   │   │       ├── faq/
│   │   │       ├── blog/
│   │   │       ├── instagram/
│   │   │       └── contact/
│   │   ├── portfolio-page/
│   │   ├── services-page/
│   │   └── contact-page/
│   ├── app.component.ts
│   ├── app.config.ts
│   └── app.routes.ts
├── styles.scss               # Tailwind + global cinematic tokens
├── index.html
└── main.ts
```

Every component is **standalone** with **OnPush** change detection and lazy-loaded via the router for instant first paint.

---

## ⚙️ Tech Stack

- **Angular 17** — standalone components, signals, router with in-memory scrolling
- **TypeScript 5.4**
- **Tailwind CSS 3.4** — custom palette, gradients, keyframes, glass utilities
- **Native canvas particles** (custom impl — particles.js-style)
- **GSAP + Anime.js** (declared, ready to extend animations)
- **Swiper** (declared, ready for additional galleries)
- **Lenis** (declared, native smooth-scroll service is shipped in lieu)

> Lenis / GSAP / Swiper / Anime.js are added to `package.json` and ready to be wired into specific micro-interactions if desired — the shipped UI already feels Awwwards-grade using a hand-rolled lightweight animation layer for performance.

---

## ♿ Accessibility

- Semantic landmarks (`<header>`, `<main>`, `<section>`, `<footer>`, `<nav>`)
- ARIA labels and roles on all interactive components
- `prefers-reduced-motion` respected globally
- Visible focus rings with gold accent
- Keyboard navigation: ESC closes menus and lightboxes, ←/→ navigates testimonials, all controls reachable

## ⚡ Performance

- Lazy routes
- `loading="lazy"` on every gallery image
- `preconnect` to Google Fonts and Unsplash
- Pure-CSS animations where possible, rAF for canvas
- OnPush change detection everywhere
- `text-balance` & `text-wrap: balance` for typography
- Defers everything off the critical path

## 🌐 SEO

- Title, description, OG, Twitter card meta in `index.html`
- LocalBusiness JSON-LD structured data
- Per-route `title` strings

---

## 🎬 Customization

| What                       | Where                                                  |
| -------------------------- | ------------------------------------------------------ |
| Colors / palette           | `tailwind.config.js`                                   |
| Typography                 | `tailwind.config.js` + `<link>` in `src/index.html`    |
| Hero images / slogan       | `pages/home/sections/hero/hero.component.ts`           |
| Service cards              | `pages/home/sections/services/services.component.ts`   |
| Portfolio items + filters  | `pages/home/sections/portfolio/portfolio.component.ts` |
| Testimonials               | `pages/home/sections/testimonials/...`                 |
| FAQ items                  | `pages/home/sections/faq/...`                          |
| Blog cards                 | `pages/home/sections/blog/...`                         |
| Contact details + calendar | `pages/home/sections/contact/...`                      |
| Social links + newsletter  | `layout/footer/...`                                    |

All textual content lives inside each component (no global config to dig through) — drop in new copy or imagery and the cinematic layout adapts.

---

## 📷 Photography credits

Demo imagery is loaded from [Unsplash](https://unsplash.com) via direct CDN links. Replace with your own gallery in production.

---

---

## 📦 Private Client Gallery System

A complete event-photo delivery platform layered on top of the presentation site.

### Architecture

```
┌────────────────────────────┐   HTTPS   ┌──────────────────────────────┐
│ Angular front-end          │ ────────▶ │ FastAPI gallery API          │
│  • /                       │           │  • /api/v1/auth   (admin)    │
│  • /gallery/:slug          │           │  • /api/v1/events (admin)    │
│  • /admin                  │           │  • /api/v1/gallery (public)  │
└────────────────────────────┘           └──────────────┬───────────────┘
                                                        │ S3 protocol
                                                        ▼
                                          ┌─────────────────────────────┐
                                          │ Cloudflare R2 bucket        │
                                          │   event/{id}/original/...   │
                                          │   event/{id}/thumb/...      │
                                          └─────────────────────────────┘
```

**No image bytes ever land on the server's disk.** Uploads stream through FastAPI into R2, the database holds only **metadata + R2 keys**, and the browser only ever fetches images via **short-lived presigned URLs** (1h previews / 15min downloads). The bucket itself stays private.

### Capabilities

- **Event CRUD** — title, client, date, optional password, expiry date
- **Unguessable share links** — `gallery/{32-hex-uuid}` per event; one click to rotate (invalidates the old link instantly)
- **Drag-and-drop uploads** — multi-file, auto EXIF-rotation, server-side JPEG thumbnail (max 1600px)
- **Public gallery experience** — masonry grid with native CSS columns, dynamic aspect ratios, lazy loading, mobile-first
- **Lightbox** — full-resolution viewer with keyboard navigation (← → Esc)
- **Per-image favorites** — stored in `localStorage`, scoped per event slug
- **Single + bulk downloads** — presigned URL per image, plus a streamed ZIP for *download all* / *download selected favorites*
- **Optional password lock** — per-event bcrypt password layered on top of the slug, issues a short-lived gallery JWT
- **Status workflow** — draft → published → expired; the public endpoint refuses everything that isn't `published` and not expired
- **Admin auth** — bcrypt + JWT, persisted in `localStorage`, route-guarded admin area

### Quick start

```bash
# 1. Backend
cd backend
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env                # fill SECRET_KEY, R2_*, BOOTSTRAP_ADMIN_*
uvicorn app.main:app --reload --port 8000

# 2. Front-end (in another terminal)
cd ..
npm install
npm start                           # http://localhost:4200
```

Then:

- Visit `http://localhost:4200/admin/login` → log in with the bootstrap admin from `.env`
- Create an event, upload photos, publish it
- Copy the **share link** from the event page and open it in an incognito tab → that's the client's view

### One-command Docker dev (Postgres + API)

```bash
docker compose up --build
```

Brings up Postgres + the FastAPI service. Run the Angular app with `npm start` alongside.

### Cloudflare R2 setup

1. Cloudflare dashboard → **R2** → *Create bucket* (e.g. `foto-bugeac`)
2. *Manage R2 API Tokens* → create a token with **Object Read & Write** scoped to that bucket
3. Copy **Account ID**, **Access Key ID**, **Secret Access Key** into `backend/.env`
4. (Optional) Connect a custom domain via *Public Buckets → Connect Domain* for permanent preview URLs — by default the API serves signed URLs so the bucket can stay fully private.

### Folder layout (new pieces only)

```
backend/                       # FastAPI service
├── app/
│   ├── main.py                # FastAPI factory + lifespan + bootstrap admin
│   ├── api/                   # auth.py · events.py · gallery.py · deps.py
│   ├── core/                  # config.py · security.py · r2.py
│   ├── db/                    # database.py · models.py
│   ├── schemas/               # auth.py · event.py · image.py
│   └── services/              # event_service · image_service · zip_service
├── requirements.txt
├── Dockerfile
├── .env.example
└── README.md                  # full backend docs

src/
├── environments/              # apiBaseUrl per environment
├── app/
│   ├── core/
│   │   ├── services/
│   │   │   ├── admin-auth.service.ts
│   │   │   ├── admin-api.service.ts
│   │   │   ├── gallery-api.service.ts
│   │   │   └── favorites.service.ts
│   │   └── guards/admin.guard.ts
│   ├── shared/models/gallery.models.ts
│   └── pages/
│       ├── gallery/gallery.component.ts        # public client view
│       └── admin/
│           ├── admin-shell.component.ts        # layout + logout
│           ├── admin-login.component.ts
│           ├── admin-dashboard.component.ts
│           └── admin-event.component.ts        # upload + share + manage

docker-compose.yml             # Postgres + API for local dev
```

### Security model

- **Slug** = unguessable 32-hex UUID, generated server-side
- **Per-event password** (optional, bcrypt) → gallery JWT scoped to that slug
- **Bucket stays private** — every preview/download is a presigned GET with a short TTL
- **`POST /events/{id}/rotate-link`** swaps the slug — old links die instantly
- **`expires_at` + `status`** retire events without losing the data

### Production checklist

- Use Postgres (`DATABASE_URL=postgresql+psycopg://...`)
- Set `ENVIRONMENT=production`, `DEBUG=false`
- Generate `SECRET_KEY` with `python -c "import secrets; print(secrets.token_urlsafe(64))"`
- Pin `CORS_ORIGINS` to your production domain
- Terminate TLS at the reverse proxy (Caddy, Nginx, Cloudflare)
- Schedule DB backups; R2 has its own durability
- Optionally cron a sweep that flips expired events to `status = EXPIRED`

See [`backend/README.md`](backend/README.md) for the full API reference.

---

## License

MIT — crafted with light & emotion.
