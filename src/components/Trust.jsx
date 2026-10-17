import { Link } from 'react-router-dom';
import { Reveal } from '../hooks/useReveal.jsx';
import { IconLock, IconLayers, IconShield, IconKey } from './Icons.jsx';

/* NOTE: these statements describe the CloudMirror TARGET design.
   Only publish them once the backend actually does all of this. */
const CARDS = [
  [IconLock, '', 'Encrypted end to end', 'Protected with TLS 1.3 while it travels and AES-256 encryption while it is stored.'],
  [IconLayers, 'icon--blue', 'Kept in several places', 'Mirrored across independent locations with versioned backups, so one outage never means lost data.'],
  [IconShield, 'icon--amber', 'No silent deletions', 'Large deletions need administrator approval, and removed records are held in quarantine before permanent purge.'],
  [IconKey, 'icon--purple', 'Controlled and audited', 'Least-privilege access, tamper-evident logs, and a recorded trail for every approval.'],
];

export default function Trust() {
  return (
    <section className="section section--soft" id="trust">
      <div className="wrap">
        <Reveal className="sec-head sec-head--center">
          <span className="kicker">Your data</span>
          <h2>Built to keep your information safe</h2>
          <p>Connected products only work if people can trust them. This is how we protect what you share with us.</p>
        </Reveal>
        <div className="cards4">
          {CARDS.map(([Icon, cls, title, text]) => (
            <Reveal as="article" className="card" key={title}>
              <div className={`icon ${cls}`.trim()}><Icon /></div>
              <h3>{title}</h3>
              <p>{text}</p>
            </Reveal>
          ))}
        </div>
        <Reveal as="p" className="trust-foot">Read the full <Link to="/privacy">privacy notice</Link>.</Reveal>
      </div>
    </section>
  );
}
