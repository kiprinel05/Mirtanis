#!/usr/bin/env bash
# Mirtanis Events — deploy script
# Usage: ./deploy.sh   (run from /var/www)
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

# --- preflight ----------------------------------------------------------------
if [[ ! -d "$BACKEND_DIR/.git" ]]; then
  echo "ERROR: $BACKEND_DIR is not a git repo" >&2; exit 1
fi
if [[ ! -d "$FRONTEND_DIR/.git" ]]; then
  echo "ERROR: $FRONTEND_DIR is not a git repo" >&2; exit 1
fi
if [[ ! -f "$BACKEND_DIR/.env" ]]; then
  echo "ERROR: $BACKEND_DIR/.env is missing. Copy .env.example and edit it." >&2; exit 1
fi
if ! command -v docker >/dev/null 2>&1; then
  echo "ERROR: docker not found in PATH" >&2; exit 1
fi

# --- pull ---------------------------------------------------------------------
echo "==> Pulling backend"
git -C "$BACKEND_DIR" pull --ff-only

echo "==> Pulling frontend"
git -C "$FRONTEND_DIR" pull --ff-only

# --- build & restart ----------------------------------------------------------
echo "==> Building images"
docker compose build --pull

echo "==> Restarting services"
docker compose up -d --remove-orphans

# --- housekeeping -------------------------------------------------------------
echo "==> Pruning dangling images"
docker image prune -f >/dev/null

echo "==> Status"
docker compose ps

echo "==> Done."
