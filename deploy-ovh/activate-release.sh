#!/usr/bin/env bash
# Run on the server as deploy user after rsync (GitHub Actions).
# Install as /usr/local/bin/activate-release-jsx.sh (do not reuse gql's activate-release-ovh.sh).
set -euo pipefail

APP_ROOT=/var/www/jsx-book-store
RELEASE_SHA="${1:?Usage: activate-release.sh <git-sha>}"
PORT="${APP_PORT:-3002}"

RELEASE="$APP_ROOT/releases/$RELEASE_SHA"
[[ -d "$RELEASE" ]] || { echo "Missing release: $RELEASE"; exit 1; }
[[ -f "$RELEASE/package.json" ]] || { echo "Missing $RELEASE/package.json"; exit 1; }
[[ -f "$RELEASE/backend/server.js" ]] || { echo "Missing $RELEASE/backend/server.js"; exit 1; }
[[ -d "$RELEASE/frontend/dist" ]] || { echo "Missing $RELEASE/frontend/dist"; exit 1; }
[[ -f "$APP_ROOT/shared/.env.production" ]] || {
  echo "Missing $APP_ROOT/shared/.env.production"
  exit 1
}

mkdir -p "$APP_ROOT/shared/uploads"

cd "$RELEASE"
ln -sfn ../../shared/.env.production .env
ln -sfn ../../shared/.env.production .env.production
rm -rf uploads
ln -sfn ../../shared/uploads uploads
npm ci --omit=dev
ln -sfn "$RELEASE" "$APP_ROOT/current"
sudo systemctl restart jsx-book-store
sleep 3
curl -sf "http://127.0.0.1:${PORT}/" >/dev/null
echo "Activated $RELEASE_SHA"
