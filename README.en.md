# jsx.book-store.com.pl

**Language:** [Polski](README.md) | English

Online bookstore: catalog, cart, checkout, Stripe / PayPal payments, and an admin panel. Monorepo with a REST API (Express + JavaScript) and a React SPA (JSX).

**Live Demo:** https://jsx.book-store.com.pl/

## What the app does

- **Catalog** — product list, search, pagination, details, reviews, featured carousel
- **Account** — register / login (JWT), profile, my orders
- **Purchase** — cart → shipping address → payment method → place order
- **Payments** — Stripe (Payment Intent + webhook) and PayPal
- **Admin** — products, users, orders
- **i18n** — PL / EN, store locator map (Google Maps)
- **Contact** — form with email delivery (SMTP)
- **Media** — product image uploads (Multer → local `uploads/` directory)

## Stack

| Layer | Technologies |
|--------|-------------|
| **Backend** | Node.js, Express 4, JavaScript (ESM), Mongoose, MongoDB, JWT, Stripe, PayPal, Multer, Nodemailer |
| **Frontend** | React 18, Vite, JSX, React Router, Redux Toolkit, MUI, Sass, Formik + Yup, i18next, Stripe.js, PayPal JS SDK |
| **Data** | MongoDB (Mongoose), local uploads (`uploads/`) |
| **Tests** | Vitest (unit / API), Cypress (e2e) |

## Repo structure

```
backend/          # Express REST API + Mongoose
frontend/         # React SPA (Vite, JSX)
uploads/          # local images (dev / production)
```

**Backend** — REST API (`/api/...`), database, JWT auth, Stripe / PayPal payments, webhook, uploads, email.  
**Frontend** — UI, routing, state (Redux), REST calls.

## Local setup

Requirements: Node.js 18+, access to a MongoDB database (e.g. Atlas).

```bash
npm install
npm install --prefix frontend
```

Configure variables in the root `.env` (e.g. `PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `JWT_SECRET`, Stripe / PayPal keys, SMTP). In development the frontend talks to the API via `VITE_BACKEND_URL` (`frontend/.env`).

Optionally seed the database with demo data:

```bash
node backend/seeder.js -i
```

Run in development mode (backend + frontend together):

```bash
npm run dev
```

- Frontend: Vite (default `http://localhost:5173`)
- Backend: REST API on the port from `PORT` (default `3002`)

Other scripts:

| Command | Description |
|---------|-------------|
| `npm run server` | backend with hot-reload (`nodemon`) |
| `npm run client` | frontend only (Vite) |
| `npm start` | production API start (also serves `frontend/dist`) |
| `node backend/seeder.js -i` | import demo data |
| `node backend/seeder.js -d` | remove seeded products |
| `npm test` | Vitest tests (backend) |
| `npm run cypress:run --prefix frontend` | Cypress headless (`frontend`) |
