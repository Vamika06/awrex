# AWREX Technologies – Website (React + Vite)

## Run it
```
npm install
npm run dev
```
The browser opens at http://localhost:5173. Requires Node.js 18 or newer (`node -v`).
Run these inside the folder that contains `package.json`.

| Command | What it does |
|---|---|
| `npm run dev` | Development server with live reload |
| `npm run build` | Production build into `dist/` (this is what you deploy) |
| `npm run preview` | Serve the production build locally to check it |

## Project layout
```
index.html               Page shell (fonts, meta tags)
src/main.jsx             Entry point (React + Router)
src/App.jsx              Routes: /  /privacy  404, scroll handling
src/config.js            Reads settings from .env (API URL, contact e-mail)
src/styles.css           All styling (colour tokens at the top)
src/pages/               Home, Privacy (DRAFT), NotFound
src/components/          Nav, Hero (fabric canvas), Problem, Platform, Demo, Products, Why, Trust, Contact, Footer
src/lib/contactApi.js    Safe form submit: idempotency key, retry queue, API contract
src/hooks/               Reveal-on-scroll, keyboard tabs
public/                  favicon, robots.txt, _headers, _redirects (copied to dist/)
vercel.json              Vercel rewrites + security headers
.env.example             Copy to .env and fill in
```

## Settings
Copy `.env.example` to `.env` and edit (restart `npm run dev` after changes):
```
VITE_API_BASE=https://api.your-domain.com     # backend URL ("" = not connected yet)
VITE_CONTACT_EMAIL=hello@your-domain.com
```
Values are baked in at **build time**. For production, set the same variables in your host's dashboard
(Netlify / Vercel / Cloudflare: "Environment variables") before building.
Never put secrets in `VITE_*` – they are public.

## Deploy
Build command `npm run build`, output directory `dist`.

| Host | How |
|---|---|
| Netlify | Connect repo (or `npm run build`, then drag `dist/` onto app.netlify.com/drop). `_redirects` and `_headers` are included. |
| Vercel | Import repo, framework "Vite". `vercel.json` is included. |
| Cloudflare Pages | Framework preset "Vite". |
| AWS S3 + CloudFront / Azure Static Web Apps | Upload `dist/`; route all paths to `index.html`; add the headers from `public/_headers`. |

Checklist before going live:
1. Set `VITE_API_BASE` and `VITE_CONTACT_EMAIL`.
2. In `public/_headers` and `vercel.json`, replace `https://api.your-domain.com` in `connect-src` with the same API origin.
3. Complete every `[bracket]` in `src/pages/Privacy.jsx` and have it legally reviewed (India DPDP Act).
4. Serve over HTTPS only (all hosts above do).

## Data requirements (from the CloudMirror deck)
CloudMirror is a **backend** design (local PostgreSQL + AWS + Azure + versioned backups, durable event log,
failover, deletion guard). A website must never connect to a database or hold cloud keys. The frontend therefore:

| Requirement | Frontend behaviour | Backend must |
|---|---|---|
| Data in multiple locations / seamless cloud switching | Talks to ONE API URL; no AWS/Azure SDK in the browser | Write to local PG + AWS + Azure + backups; primary is a server config switch |
| Survive a cloud failure, no data loss | Shows "sent" only on a 2xx reply; retries on network/5xx; unsent message kept in the tab and resent when online | Acknowledge only after the durable event-log write; queue and replay to a recovered cloud |
| Duplicates after retry | Sends an `Idempotency-Key` header | Treat repeated keys as one record |
| Deletion safeguard | The site has no delete/bulk operations; privacy notice discloses the quarantine delay | Soft-delete quarantine 7–14 days, admin approval for large deletions, audit trail |
| TLS 1.3 / AES-256 / RBAC / audit | HTTPS + HSTS, strict CSP, no third-party scripts, no cookies, `credentials: omit` | TLS 1.3, AES-256, KMS/Key Vault, least privilege, signed logs, mTLS between services |

API the backend should provide:
```
POST {VITE_API_BASE}/v1/contact
Headers: Content-Type: application/json, Idempotency-Key: <uuid>
Body:    { name, email, organization, interest, message, consent: true, consentVersion, source, page, clientTime }
200/201/202 = stored durably   4xx = rejected (not retried)   5xx/408/429 = client retries
```
Also enforce server-side: CORS allow-list for your site origin, rate limiting, input validation, spam checks,
and logs that do not contain message bodies.

## Important notes
- Do **not** collect health/biometric data on this public site; that needs an authenticated app and a compliance review.
- The "Your data" section and privacy notice describe the CloudMirror **target** design. Publish those claims only once the backend does them.
- Demo signals are simulated and labelled so; products are described as "under development". Avoid medical-performance or certification claims without evidence and regulatory review.
- Contact e-mail, logo and legal text are placeholders. Content is based on the AWREX pitch document.
- Fonts load from Google Fonts. To self-host, add Sora and Manrope files under `public/fonts`, add `@font-face` rules, and remove the Google URLs from `index.html` and the CSP.
