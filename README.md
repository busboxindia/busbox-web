# BUSBOX website

Official website for BUSBOX: home, about, how it works, contact, legal pages and the receiver
parcel-tracking page (`/t/<token>`). Built with React, TypeScript and Vite.

## Run locally

```bash
npm install
cp .env.example .env      # then fill in the values
npm run dev               # http://localhost:5173
```

## Build

```bash
npm run build             # output in dist/
```

## Settings (`.env`)

| Variable | What it is |
|---|---|
| `VITE_API_URL` | BUSBOX API base URL, used by the tracking page |
| `VITE_MAPBOX_TOKEN` | Mapbox public token for the tracking map |
| `VITE_PLAY_STORE_URL` / `VITE_APP_STORE_URL` | App store links |
| `VITE_SUPPORT_EMAIL` | Contact email (busboxindia@gmail.com) |
| `VITE_SUPPORT_PHONE` | WhatsApp / phone number with country code (+918088962704) |

`.env` is not committed. Set the same variables in your hosting provider's settings.

## Deploy

- **Vercel:** import the repo. The framework is detected as Vite, and `vercel.json` makes direct links such as `/terms` work.
- **Docker:** `docker build -t busbox-web .` (pass the variables as `--build-arg`).
