import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Reveal } from '../hooks/useReveal.jsx';
import { IconMail } from './Icons.jsx';
import { config } from '../config.js';
import { endpoint, isLocalDev, post, readQueue, writeQueue, uuid } from '../lib/contactApi.js';

const INTERESTS = ['Healthcare monitoring', 'Wellness & therapy', 'Sports & fitness', 'Home care', 'Partnership / investment', 'Something else'];

const RULES = {
  name: v => v.trim().length >= 2 || 'Please enter your name.',
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Please enter a valid email address.',
  interest: v => !!v || 'Please choose one.',
  message: v => v.trim().length >= 10 || 'Please tell us a little more (at least 10 characters).',
  consent: v => v === true || 'Please tick this box so we can store your details and reply.',
};

export default function Contact() {
  const formRef = useRef(null);
  const flushing = useRef(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);      // { kind: 'ok'|'warn'|'bad', text, mail? }
  const [busy, setBusy] = useState(false);

  /* resend anything that failed earlier in this tab */
  const flush = useCallback(async () => {
    if (flushing.current || !endpoint) return;
    flushing.current = true;
    let q = readQueue();
    for (const item of [...q]) {
      const r = await post(item);
      if (r === 'sent' || r === 'rejected') {
        q = q.filter(i => i.key !== item.key); writeQueue(q);
        if (r === 'sent') setStatus({ kind: 'ok', text: 'Your earlier message has now been delivered. Thank you!' });
      } else break;
    }
    flushing.current = false;
    if (readQueue().length) setTimeout(flush, 30000);
  }, []);

  useEffect(() => {
    flush();
    window.addEventListener('online', flush);
    return () => window.removeEventListener('online', flush);
  }, [flush]);

  const onSubmit = async e => {
    e.preventDefault();
    const form = formRef.current;
    const f = new FormData(form);
    const data = { name: f.get('name') || '', email: f.get('email') || '', interest: f.get('interest') || '', message: f.get('message') || '', consent: form.consent.checked };

    const errs = {};
    for (const k in RULES) { const r = RULES[k](data[k]); if (r !== true) errs[k] = r; }
    setErrors(errs);
    if (Object.keys(errs).length) { form.querySelector('.has-error input, .has-error select, .has-error textarea')?.focus(); return; }

    if (f.get('website')) { setStatus({ kind: 'ok', text: 'Thank you! We will be in touch soon.' }); form.reset(); return; }   // honeypot: bots only

    const item = { key: uuid(), payload: {
      name: data.name.trim(), email: data.email.trim(), organization: (f.get('organization') || '').trim(), interest: data.interest,
      message: data.message.trim(), consent: true, consentVersion: config.consentVersion, source: 'website',
      page: location.pathname, clientTime: new Date().toISOString() } };

    setBusy(true);
    try {
      if (!endpoint) {
        // Not configured: never pretend a real visitor's message was saved.
        if (isLocalDev) { setStatus({ kind: 'warn', text: 'Demo mode: no API is configured, so nothing was sent. Set VITE_API_BASE in your .env file.' }); form.reset(); }
        else setStatus({ kind: 'bad', text: 'Our contact form is temporarily unavailable.', mail: true });
        return;
      }
      const r = await post(item);
      if (r === 'sent') { setStatus({ kind: 'ok', text: 'Thank you! Your message has been received and we will be in touch soon.' }); form.reset(); }
      else if (r === 'retry') {
        const q = readQueue(); q.push(item); writeQueue(q); setTimeout(flush, 5000);
        setStatus({ kind: 'warn', text: 'We could not reach our server just now. Your message is saved in this tab and will be sent automatically when the connection returns. Please keep this page open.' });
      } else setStatus({ kind: 'bad', text: 'Sorry, we could not accept that message. Please check your details and try again.', mail: true });
    } finally { setBusy(false); }
  };

  const Err = ({ k }) => <span className="err">{errors[k] || ''}</span>;
  const cls = k => `field${errors[k] ? ' has-error' : ''}`;

  return (
    <section className="section" id="contact">
      <div className="wrap contact">
        <Reveal className="contact__info">
          <span className="kicker eyebrow">Get in touch</span>
          <h2>Let's build something together</h2>
          <p>Whether you are exploring healthcare monitoring, wellness, sports, home care, or a partnership, tell us what you are working on.</p>
          <ul className="contact__list">
            <li><span className="icon"><IconMail /></span><a href={`mailto:${config.contactEmail}`}>{config.contactEmail}</a></li>
          </ul>
        </Reveal>

        <Reveal as="form" className="form" ref={formRef} noValidate onSubmit={onSubmit}>
          <div className="row2">
            <div className={cls('name')}><label htmlFor="f-name">Name</label><input id="f-name" name="name" autoComplete="name" maxLength={100} /><Err k="name" /></div>
            <div className={cls('email')}><label htmlFor="f-email">Email</label><input id="f-email" name="email" type="email" autoComplete="email" maxLength={200} /><Err k="email" /></div>
          </div>
          <div className="row2">
            <div className="field"><label htmlFor="f-org">Organisation <small>(optional)</small></label><input id="f-org" name="organization" autoComplete="organization" maxLength={150} /></div>
            <div className={cls('interest')}>
              <label htmlFor="f-interest">I'm interested in</label>
              <select id="f-interest" name="interest" defaultValue="">
                <option value="">Choose one…</option>
                {INTERESTS.map(i => <option key={i}>{i}</option>)}
              </select>
              <Err k="interest" />
            </div>
          </div>
          <div className={cls('message')}><label htmlFor="f-msg">Message</label><textarea id="f-msg" name="message" maxLength={2000} /><Err k="message" /></div>
          <div className="hp" aria-hidden="true"><label>Leave this empty<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
          <label className="consent">
            <input type="checkbox" name="consent" id="f-consent" />
            <span>I agree that AWREX may store my details to reply to this message, as described in the <Link to="/privacy" target="_blank">privacy notice</Link>. Please do not include health information in this form.</span>
          </label>
          <Err k="consent" />
          <div className={`form-status${status ? ` show ${status.kind}` : ''}`} role="status" aria-live="polite">
            {status?.text}
            {status?.mail && <> You can also write to us at <a href={`mailto:${config.contactEmail}`}>{config.contactEmail}</a>.</>}
          </div>
          <button className="btn btn--primary" type="submit" disabled={busy}>{busy ? 'Sending…' : 'Send message'}</button>
        </Reveal>
      </div>
    </section>
  );
}
