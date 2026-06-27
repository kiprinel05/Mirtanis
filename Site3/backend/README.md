# Foto Bugeac — Gallery API

Private client gallery + admin backend for the Foto Bugeac studio.
Python · FastAPI · SQLAlchemy · Cloudflare R2.

The presentation website (Angular) stays untouched — this service adds:

- Admin login + JWT session
- Event CRUD with rotating share links
- Image upload → original + thumbnail in **Cloudflare R2** (no images on the server)
- Public gallery endpoint accessed by **unguessable event slug**
- Optional per-event password
- Per-image signed download URLs
- Streamed ZIP "download all / download selected"

---

## Architecture

```
┌────────────────────────┐  HTTPS   ┌────────────────────────────┐
│ Angular front-end      │ ───────▶ │ FastAPI gallery API        │
│  • /                   │          │  • /api/v1/auth            │
│  • /gallery/:slug      │          │  • /api/v1/events  (admin) │
│  • /admin              │          │  • /api/v1/gallery (public)│
└────────────────────────┘          └─────────────┬──────────────┘
                                                  │ S3 protocol
                                                  ▼
                                       ┌─────────────────────────┐
                                       │ Cloudflare R2 bucket    │
                                       │  event/{id}/original/   │
                                       │  event/{id}/thumb/      │
                                       └─────────────────────────┘
```

No image bytes ever land on disk: uploads stream through FastAPI into R2,
the DB only stores the **R2 keys** + metadata. The browser always loads
photos via short-lived **presigned URLs** — the bucket itself can stay
private.

---

## Local setup

### 1. Install
```bash
cd backend
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure
```bash
cp .env.example .env
# Edit .env — at minimum fill in:
#   SECRET_KEY
#   BOOTSTRAP_ADMIN_EMAIL / BOOTSTRAP_ADMIN_PASSWORD
#   R2_ACCOUNT_ID / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY
#   R2_BUCKET
```

### 3. Run
```bash
uvicorn app.main:app --reload --port 8000
```

The first start creates `foto_bugeac.db` (SQLite) and bootstraps your
admin user from `.env`. Swagger UI: <http://localhost:8000/docs>.

---

## Cloudflare R2 setup

1. Cloudflare dashboard → **R2** → *Create bucket* (e.g. `foto-bugeac`)
2. *Manage R2 API Tokens* → create a token with **Object Read & Write**
   scoped to that bucket
3. Copy the **Account ID**, **Access Key ID**, **Secret Access Key** into `.env`
4. (Optional) Connect a custom domain via *Public Buckets → Connect Domain*
   for permanent preview URLs. Otherwise the API serves signed URLs.

---

## API surface (`/api/v1`)

### Auth
| Method | Path           | Body                          | Auth   |
| ------ | -------------- | ----------------------------- | ------ |
| POST   | `/auth/login`  | `{email, password}`           | public |
| GET    | `/auth/me`     |                               | admin  |

### Events (studio only)
| Method | Path                                          | Notes                          |
| ------ | --------------------------------------------- | ------------------------------ |
| GET    | `/events`                                     | paginated list                 |
| POST   | `/events`                                     | create draft event             |
| GET    | `/events/{id}`                                | event detail                   |
| PATCH  | `/events/{id}`                                | update + publish               |
| DELETE | `/events/{id}`                                | hard delete + R2 cleanup       |
| POST   | `/events/{id}/rotate-link`                    | invalidate old slug            |
| GET    | `/events/{id}/images`                         | list image metadata            |
| POST   | `/events/{id}/images`                         | multipart upload (many files)  |
| PATCH  | `/events/{id}/images/reorder`                 | `{ordered_ids: [...]}`         |
| POST   | `/events/{id}/images/{imageId}/cover`         | set as event cover             |
| DELETE | `/events/{id}/images/{imageId}`               | remove image                   |

### Public gallery (no auth — just the slug)
| Method | Path                                                 |
| ------ | ---------------------------------------------------- |
| GET    | `/gallery/{slug}`                                    |
| POST   | `/gallery/{slug}/unlock` *(when password-protected)* |
| GET    | `/gallery/{slug}/images`                             |
| GET    | `/gallery/{slug}/images/{imageId}/download`          |
| POST   | `/gallery/{slug}/download` — streams ZIP             |

---

## Security model

- **Slug = unguessable**. 32-hex UUID, generated server-side.
- **Per-event password** (optional). Hashed with bcrypt; client gets a
  short-lived gallery JWT after unlocking, then passes it in `Authorization`.
- **No direct R2 access**. The bucket is private; every image URL is a
  signed GET that expires in 1h (previews) or 15min (downloads).
- **`rotate-link`** swaps the slug — old shared links instantly stop working.
- **`expires_at`** + `status` let the studio retire events without deleting them.

---

## Production checklist

- Use Postgres: `DATABASE_URL=postgresql+psycopg://...`
- Set `ENVIRONMENT=production`, `DEBUG=false`
- Generate `SECRET_KEY` with `python -c "import secrets; print(secrets.token_urlsafe(64))"`
- Lock `CORS_ORIGINS` to the production domain
- Run behind a reverse proxy with TLS (Caddy, Nginx, Cloudflare)
- Add a backup job for the Postgres DB; R2 has its own durability
- Schedule a cleanup cron for expired events if desired (`status == EXPIRED`)
