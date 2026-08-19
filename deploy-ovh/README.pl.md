# Deploy OVH — jsx.book-store.com.pl

Instalacja na nowym VPS Ubuntu (ten sam model co tsx / gql / nest).

Workflow: [`.github/workflows/deploy-ovh.yml`](../.github/workflows/deploy-ovh.yml)

**Język:** Polski | [English](README.md)

Szczegóły kroków (pakiety, Caddy, systemd, sekrety GitHub) — w [README.md](README.md) (EN). Poniżej skrót po polsku.

## DNS

W strefie `book-store.com.pl`: rekord **A** `jsx` → publiczne IP VPS.

## Firewall

| Port | Usługa |
|------|--------|
| 49152/tcp | SSH |
| 80 / 443 | Caddy (HTTP/HTTPS) |

Node (`3002`) tylko na `127.0.0.1`. MongoDB jest w Atlasie (nie lokalnie na VPS).

## Bootstrap

1. Node 22, git, rsync, Caddy
2. Katalogi `/var/www/jsx-book-store/{releases,shared/uploads}`
3. `shared/.env.production` — wzór [shared.env.production.example](shared.env.production.example)
   - `PORT=3002`, `JWT_SECRET` min. 32 znaki
   - `DB_*` (Atlas), Stripe, SMTP, PayPal
4. systemd + **`activate-release-jsx.sh`** (nie `activate-release-ovh.sh` — to skrypt gql)
5. Webhook Stripe: `https://jsx.book-store.com.pl/api/webhooks/stripe`

## Deploy

**Actions** → **Deploy to OVH** → branch `main`.

## Seed bazy

Po pierwszym deployu:

```bash
cd /var/www/jsx-book-store/current
node backend/seeder.js -i
```

Admin: `admin@test.pl` / `ADMIN_PASSWORD` z `shared/.env.production`. Szczegóły: [README.md § 4](README.md#database-seed-products--admin-user).
