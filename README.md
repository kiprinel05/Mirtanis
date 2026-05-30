# Mirtanis Events — Full-Stack

Premium cinematic website for **Mirtanis Events** — locație pe lac pentru nunți, botezuri, cununii și evenimente private.

Stack:
- **Frontend:** Angular 19 (standalone components, signals), TailwindCSS, Anime.js / GSAP, Lenis smooth scroll.
- **Backend:** FastAPI, SQLAlchemy 2, PostgreSQL, JWT auth, calendar booking system, gallery uploads.
- **Infra:** Docker + docker-compose, Nginx reverse-proxying the SPA to the API.

---

## Architecture

```
Mirtanis/
├── backend/                 FastAPI app
│   ├── app/
│   │   ├── api/             Routers: auth, bookings, calendar, contact, gallery, admin
│   │   ├── core/            security, deps
│   │   ├── models/          SQLAlchemy models
│   │   ├── schemas/         Pydantic schemas
│   │   ├── config.py        Settings (env-driven)
│   │   ├── database.py      Engine + session
│   │   └── main.py          App factory, lifespan, CORS, admin bootstrap
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── frontend/                Angular 19 SPA
│   ├── src/app/
│   │   ├── core/            services, guards, interceptors, models
│   │   ├── shared/          navbar, footer, cursor, reveal/parallax directives
│   │   └── pages/           home (cinematic sections), gallery, booking, contact,
│   │                        locations, admin (login + dashboard)
│   ├── tailwind.config.js   Design tokens (ink/gold/lake palette + luxury motion)
│   ├── angular.json
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml
└── README.md
```

---

## Quick start (Docker — recommended)

```bash
cp backend/.env.example backend/.env       # edit JWT_SECRET_KEY + ADMIN_PASSWORD
docker compose up --build
```

- Frontend → http://localhost:4200
- API docs → http://localhost:8000/api/docs
- Admin    → http://localhost:4200/admin/login (use the credentials from `.env`)

The first time the API boots, it creates the schema and bootstraps the admin user.

---

## Local dev (without Docker)

### Backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate    # PowerShell: .venv\Scripts\Activate.ps1
pip install -r requirements.txt
cp .env.example .env
# Point DATABASE_URL to a local Postgres, or use SQLite by overriding to: sqlite:///./mirtanis.db
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm start
# http://localhost:4200
```

---

## Backend API

Base prefix: `/api/v1`

| Method | Path                                | Auth   | Description |
|--------|-------------------------------------|--------|-------------|
| POST   | `/auth/login`                       | —      | OAuth2 form login (Swagger) |
| POST   | `/auth/login-json`                  | —      | JSON login (used by SPA) |
| GET    | `/auth/me`                          | admin  | Current admin |
| POST   | `/bookings`                         | —      | Submit booking request |
| GET    | `/bookings`                         | admin  | List + filter bookings |
| PATCH  | `/bookings/{id}`                    | admin  | Update status / message |
| DELETE | `/bookings/{id}`                    | admin  | Delete booking |
| GET    | `/calendar?start=&end=`             | —      | Public availability map |
| POST   | `/calendar/availability`            | admin  | Upsert day override |
| DELETE | `/calendar/availability/{day}`      | admin  | Reset day |
| POST   | `/contact`                          | —      | Send contact message |
| GET    | `/contact`                          | admin  | List messages |
| PATCH  | `/contact/{id}/read`                | admin  | Mark read |
| GET    | `/gallery`                          | —      | Public gallery |
| POST   | `/gallery` (multipart)              | admin  | Upload image |
| PATCH/DELETE `/gallery/{id}`        | admin  | Manage image |
| GET    | `/admin/stats`                      | admin  | Dashboard stats |

The calendar response merges, in priority:
1. admin overrides (`AvailabilityDay`),
2. confirmed bookings → `booked`,
3. pending bookings → `pending`,
4. else → `available`.

---

## Frontend

### Design system
- Palette: deep **ink** (`#05070A`), **gold** (`#CDA64A`) accents, **lake** teals.
- Type: **Cormorant Garamond** display + **Inter** body — preloaded from Google Fonts.
- Tokens live in `tailwind.config.js`; reusable utilities (`.glass`, `.btn`, `.gold-text`, `.reveal`, `.water-reflect`, `.img-cine`) in `src/styles.scss`.

### Motion
- **Hero** intro uses Anime.js for staggered line/CTA reveal.
- **Reveal on scroll** via `[appReveal]` (IntersectionObserver, no layout thrash).
- **Parallax** via `[appParallax]` (rAF-free, `window:scroll` host listener; tweak `parallaxFactor`).
- **Smooth scroll** via Lenis (dynamic import, respects `prefers-reduced-motion`).
- **Custom cursor** with `mix-blend-mode: difference`; auto-hides on touch.
- **Page transitions** via Angular `withViewTransitions()` + `.route-enter` keyframe.

### Pages
- `/` — Hero (video + particles) → Story (parallax split) → Locations (2 venues) → Lake experience → Testimonials → CTA.
- `/locatii` — Cort Premium & Sala Interioară long-form, alternating parallax.
- `/galerie` — masonry (CSS columns), category filter, fullscreen lightbox.
- `/rezervari` — calendar (color-coded availability) + 3-step form (event / contact / confirmation).
- `/contact` — info + OSM embed + form.
- `/admin/login` & `/admin` — JWT-protected dashboard: stats, booking pipeline, calendar overrides.

### SEO & performance
- `<meta>` description + Open Graph + JSON-LD `EventVenue` schema in `index.html`.
- Lazy-loaded routes (`loadComponent`), lazy images everywhere.
- Tailwind purge via `content` glob; production bundle budgets configured in `angular.json`.
- Nginx serves long-cache headers for hashed assets and gzip for text.

---

## Admin

Default credentials (override in `.env` before first boot):
```
admin@mirtanis.ro / ChangeMeNow!2026
```

Admin can:
- View live stats (bookings, pending, confirmed, unread messages).
- Confirm / reject / delete bookings.
- Block, mark as booked/pending, or release any calendar date.
- (Endpoint ready) Upload, edit, delete gallery images.
- (Endpoint ready) Read & manage contact messages.

---

## Production checklist

- [ ] Replace `JWT_SECRET_KEY` with a long random value.
- [ ] Set `APP_ENV=production`, `DEBUG=False`.
- [ ] Add a real reverse proxy with HTTPS (Caddy / Traefik / Nginx + certbot) in front of `frontend`.
- [ ] Configure `CORS_ORIGINS` to your production domain only.
- [ ] Back up the `mirtanis_pg_data` volume.
- [ ] Replace stock hero video / fallback images in `public/` and `assets/`.
- [ ] Hook `contact` and `bookings` create endpoints into an email/notification pipeline.
