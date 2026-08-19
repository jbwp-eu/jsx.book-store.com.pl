# Deploy OVH — jsx.book-store.com.pl

Install the app on a new Ubuntu VPS (same layout as tsx / gql / nest).

Workflow: [`.github/workflows/deploy-ovh.yml`](../.github/workflows/deploy-ovh.yml)

```
/var/www/jsx-book-store/
├── current -> releases/<sha>/
├── releases/<sha>/
└── shared/
    ├── .env.production
    └── uploads/
```

Caddy terminates HTTPS and proxies to Node on `127.0.0.1:3002`. DNS for `jsx.book-store.com.pl` must point at this VPS before the first Caddy reload (Let's Encrypt).

MongoDB is **Atlas** (connection in `backend/config/db.js`). Product images persist in `shared/uploads`.

**Language:** [Polski](README.pl.md) | English

---

## 1. Server setup (SSH as `ubuntu`, port **49152**)

### 1.1 Packages + Node 22 + Caddy

```bash
sudo apt-get update
sudo apt-get upgrade -y
sudo apt-get install -y curl git build-essential rsync

curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

sudo apt-get install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt-get update
sudo apt-get install -y caddy
```

### 1.2 App directories

```bash
sudo mkdir -p /var/www/jsx-book-store/{releases,shared/uploads}
sudo chown -R ubuntu:ubuntu /var/www/jsx-book-store
```

### 1.3 Production environment

```bash
nano /var/www/jsx-book-store/shared/.env.production
```

Use [shared.env.production.example](shared.env.production.example). Required:

- `NODE_ENV=production`, `PORT=3002`
- `DB_USER` / `DB_PASSWORD` / `DB_NAME` for MongoDB Atlas
- `JWT_SECRET` at least 32 characters (not the example placeholder)
- Stripe `STRIPE_SECRET_KEY_TEST_MODE` + `STRIPE_WEBHOOK_SECRET_TEST_MODE`
- SMTP / PayPal as needed

```bash
chmod 600 /var/www/jsx-book-store/shared/.env.production
```

### 1.4 Caddyfile

```bash
sudo nano /etc/caddy/Caddyfile
```

Use [Caddyfile.example](Caddyfile.example). If this VPS already hosts other `*.book-store.com.pl` sites, **append** the `jsx.book-store.com.pl` block — do not replace the whole file.

```bash
sudo systemctl enable caddy
sudo systemctl reload caddy
```

### 1.5 systemd + activate script

The activate script **must** be named `activate-release-jsx.sh`. On this VPS `activate-release-ovh.sh` belongs to gql (`/var/www/gql-book-store`).

```bash
scp -P 49152 deploy-ovh/jsx-book-store.service.example ubuntu@<OVH_HOST>:/tmp/
ssh -p 49152 ubuntu@<OVH_HOST> \
  'sudo cp /tmp/jsx-book-store.service.example /etc/systemd/system/jsx-book-store.service && sudo systemctl daemon-reload && sudo systemctl enable jsx-book-store'

echo 'ubuntu ALL=(root) NOPASSWD: /bin/systemctl restart jsx-book-store, /bin/systemctl status jsx-book-store' | sudo tee /etc/sudoers.d/jsx-ubuntu
sudo chmod 440 /etc/sudoers.d/jsx-ubuntu

scp -P 49152 deploy-ovh/activate-release.sh ubuntu@<OVH_HOST>:/tmp/
ssh -p 49152 ubuntu@<OVH_HOST> \
  'sudo install -m 755 /tmp/activate-release.sh /usr/local/bin/activate-release-jsx.sh'
```

---

## 2. GitHub — secrets and variables

**Secrets:** `OVH_HOST`, `OVH_SSH_KEY`, `VITE_STRIPE_PUBLISHABLE_KEY_TEST_MODE_OVH`, `VITE_GOOGLE_MAPS_API_KEY`

**Variables:** `DEPLOY_BASE_URL_OVH=https://jsx.book-store.com.pl`, optional `OVH_USER` (default `ubuntu`), optional `VITE_GOOGLE_MAPS_MAP_ID`

SSH port is **49152**. Deploy public key in `~/.ssh/authorized_keys`.

---

## 3. Deploy

**Actions** → **Deploy to OVH** → **Run workflow** (branch `main`).

Stripe webhook: `https://jsx.book-store.com.pl/api/webhooks/stripe`

---

## 4. Verify

```bash
curl -sS https://jsx.book-store.com.pl/
sudo systemctl status jsx-book-store
journalctl -u jsx-book-store -e
```

### Database seed (products + admin user)

After the first deploy, seed once from the active release (needs `shared/.env.production` linked as `.env`):

```bash
cd /var/www/jsx-book-store/current
node backend/seeder.js -i
```

Seeded admin: email `admin@test.pl`, password = `ADMIN_PASSWORD` from env.
