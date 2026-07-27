# [jsx.book-store.com.pl](http://jsx.book-store.com.pl)

**Język:** Polski | [English](README.en.md)

Full-stackowy sklep z książkami (monorepo): SPA **React 18** + **Vite** (JSX) z **Sass**, **Redux Toolkit** i **React Router v7** (data mode); REST API **Express** z **Mongoose**, **MongoDB** i **JWT**. Płatności: **Stripe** i **PayPal**; lokalne uploady. Testy: **Vitest**, **Supertest**, **Cypress**.

**Live Demo:** [https://jsx.book-store.com.pl/](https://jsx.book-store.com.pl/)

## Co robi aplikacja

- **Katalog** — lista produktów, wyszukiwanie, paginacja, szczegóły, recenzje, karuzela wyróżnionych
- **Konto** — rejestracja / logowanie (JWT), profil, moje zamówienia
- **Zakup** — koszyk → adres wysyłki → metoda płatności → złożenie zamówienia
- **Płatności** — Stripe (Payment Intent + webhook) oraz PayPal
- **Admin** — produkty, użytkownicy, zamówienia
- **i18n** — PL / EN, mapa lokalizacji sklepu (Google Maps)
- **Kontakt** — formularz z wysyłką e-mail (SMTP)
- **Media** — upload obrazów produktów (Multer → lokalny katalog `uploads/`)

## Stack

| Warstwa      | Technologie                                                                                                  |
| ------------ | ------------------------------------------------------------------------------------------------------------ |
| **Backend**  | Node.js, Express 4, JavaScript (ESM), Mongoose, MongoDB, JWT, Stripe, PayPal, Multer, Nodemailer             |
| **Frontend** | React 18, Vite, JSX, React Router, Redux Toolkit, MUI, Sass, Formik + Yup, i18next, Stripe.js, PayPal JS SDK |
| **Dane**     | MongoDB (Mongoose), uploady lokalne (`uploads/`)                                                             |
| **Testy**    | Vitest (unit / API), Cypress (e2e)                                                                           |

## Struktura repo

```
backend/          # Express REST API + Mongoose
frontend/         # React SPA (Vite, JSX)
uploads/          # lokalne obrazy (dev / produkcja)
```

**Backend** — API REST (`/api/...`), baza, auth JWT, płatności Stripe / PayPal, webhook, upload, maile.  
**Frontend** — UI, routing, stan (Redux), wywołania REST.

## Uruchomienie lokalne

Wymagania: Node.js 18+, dostęp do bazy MongoDB (np. Atlas).

```bash
npm install
npm install --prefix frontend
```

Skonfiguruj zmienne w `.env` w katalogu głównym (m.in. `PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `JWT_SECRET`, klucze Stripe / PayPal, SMTP). Frontend w dev łączy się z API przez `VITE_BACKEND_URL` (plik `frontend/.env`).

Opcjonalnie zasil bazę danymi demo:

```bash
node backend/seeder.js -i
```

Uruchomienie w trybie deweloperskim (backend + frontend naraz):

```bash
npm run dev
```

- Frontend: Vite (domyślnie `http://localhost:5173`)
- Backend: REST API na porcie z `PORT` (domyślnie `3002`)

Inne skrypty:

| Komenda                                 | Opis                                                |
| --------------------------------------- | --------------------------------------------------- |
| `npm run server`                        | backend z hot-reload (`nodemon`)                    |
| `npm run client`                        | sam frontend (Vite)                                 |
| `npm start`                             | produkcyjny start API (serwuje też `frontend/dist`) |
| `node backend/seeder.js -i`             | import danych demo                                  |
| `node backend/seeder.js -d`             | usunięcie produktów z seeda                         |
| `npm test`                              | testy Vitest (backend)                              |
| `npm run cypress:run --prefix frontend` | Cypress headless (`frontend`)                       |
