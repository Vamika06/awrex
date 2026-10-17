/*
 * Contract with the backend (CloudMirror application server):
 *   POST {apiBase}{contactPath}
 *   Headers: Content-Type: application/json, Idempotency-Key: <uuid>
 *   Body:    { name, email, organization, interest, message, consent, consentVersion, source, page, clientTime }
 *   Success: HTTP 200/201/202 – the server MUST reply only AFTER the message is durably written
 *            (event log first, then mirrored to the replicas) – the "no data loss" rule.
 *   Retries: the same Idempotency-Key is re-sent, so the server must treat repeats as ONE message.
 * The site never talks to a database or cloud SDK, only to this API.
 */
import { config } from '../config.js';

export const endpoint = config.apiBase ? config.apiBase + config.contactPath : '';
export const isLocalDev = ['localhost', '127.0.0.1', ''].includes(location.hostname);

const QUEUE = 'awrex.pending';

export const uuid = () => (crypto.randomUUID ? crypto.randomUUID()
  : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => { const r = (Math.random() * 16) | 0; return (c === 'x' ? r : (r & 3) | 8).toString(16); }));

/* Unsent messages are kept only for this browser tab and removed once the server confirms. */
export const readQueue = () => { try { return JSON.parse(sessionStorage.getItem(QUEUE) || '[]'); } catch { return []; } };
export const writeQueue = q => { try { sessionStorage.setItem(QUEUE, JSON.stringify(q)); } catch { /* storage unavailable */ } };

/** Returns 'sent' | 'retry' (network/5xx/408/429) | 'rejected' (other 4xx, never retried). */
export async function post(item) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 12000);
  try {
    const res = await fetch(endpoint, {
      method: 'POST', credentials: 'omit', signal: ctl.signal,
      headers: { 'Content-Type': 'application/json', 'Idempotency-Key': item.key },
      body: JSON.stringify(item.payload),
    });
    if (res.ok) return 'sent';
    return res.status >= 500 || res.status === 408 || res.status === 429 ? 'retry' : 'rejected';
  } catch { return 'retry'; } finally { clearTimeout(timer); }
}
