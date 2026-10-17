// Runtime settings come from Vite env variables (see .env.example). Public values only – no secrets.
const env = import.meta.env;

export const config = {
  apiBase: (env.VITE_API_BASE || '').replace(/\/$/, ''),
  contactPath: env.VITE_CONTACT_PATH || '/v1/contact',
  contactEmail: env.VITE_CONTACT_EMAIL || 'hello@your-domain.com',
  consentVersion: env.VITE_CONSENT_VERSION || '2026-10-v1',
};
