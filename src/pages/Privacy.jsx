import { config } from '../config.js';

const Todo = ({ children }) => <span className="todo">{children}</span>;

export default function Privacy() {
  return (
    <div className="wrap doc">
      <h1>Privacy notice</h1>
      <p className="lead">How AWREX Technologies Pvt. Ltd. handles the information you send us through this website.</p>
      <p><Todo>Draft for legal review</Todo> Items in <Todo>[brackets]</Todo> must be completed and the whole notice reviewed by a qualified adviser (including against India's Digital Personal Data Protection Act) before the site goes public.</p>

      <h2>What we collect</h2>
      <ul>
        <li>The details you type into the contact form: name, email address, organisation (optional), area of interest and your message.</li>
        <li>A record of your consent (the notice version and the time you agreed).</li>
        <li>Please do not send health information through this form. This website is not a way to share medical data.</li>
      </ul>

      <h2>Why we use it</h2>
      <p>Only to reply to your enquiry and to discuss products or partnerships you asked about. <Todo>[Add any other purpose, e.g. product updates, only if you ask for consent separately.]</Todo></p>

      <h2>How it is protected</h2>
      <ul>
        <li>Data is encrypted in transit (TLS 1.3) and at rest (AES-256).</li>
        <li>It is stored in more than one independent location, with versioned backups, so a single outage does not cause data loss.</li>
        <li>Access is limited by role, using separate least-privilege credentials, and administrative actions are logged.</li>
        <li>Large or bulk deletions require administrator approval, and deleted records are held in quarantine for a short period before permanent removal. Because of this, a deletion request can take up to <Todo>[7–14 days]</Todo> to complete fully.</li>
      </ul>

      <h2>How long we keep it</h2>
      <p><Todo>[Retention period, e.g. 12 months after our last contact.]</Todo></p>

      <h2>Who we share it with</h2>
      <p>Our cloud infrastructure providers, who process data on our behalf. <Todo>[List providers and countries of storage.]</Todo> We do not sell your information.</p>

      <h2>Your choices</h2>
      <p>You can ask to see, correct or delete your information at any time by writing to <a href={`mailto:${config.contactEmail}`}>{config.contactEmail}</a>. <Todo>[Name a grievance / data-protection contact.]</Todo></p>

      <h2>Cookies</h2>
      <p>This website does not use advertising or analytics cookies. <Todo>[Update if analytics are added.]</Todo></p>
    </div>
  );
}
