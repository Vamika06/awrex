import { useState } from 'react';
import { Reveal } from '../hooks/useReveal.jsx';

const ROWS = [
  ['Skin contact', 'Electrodes lose contact with the skin', 'Textile electrodes keep a stable, low-impedance skin interface'],
  ['Comfort', 'Adhesives irritate the skin', 'Skin-compatible, flexible fabric with no adhesive'],
  ['Movement', 'Wires restrict natural movement', 'Conductivity built into the textile, so it moves with you'],
  ['Continuity', 'Repeated replacement interrupts use', 'Washable and reusable for extended use'],
  ['Warmth', 'Rigid, separate heating devices', 'Controlled warmth that conforms naturally to the body'],
];

export default function Problem() {
  const [awrex, setAwrex] = useState(false);
  return (
    <section className="section" id="problem">
      <div className="wrap">
        <Reveal className="sec-head">
          <span className="kicker">Why textiles</span>
          <h2>Monitoring breaks down at the body–device interface</h2>
          <p>When monitoring must continue for hours or days, contact, comfort and continuity become the limiting factor. Flip the switch to see how a textile-native approach changes that.</p>
        </Reveal>

        <Reveal className={`compare${awrex ? ' is-awrex' : ''}`}>
          <div className="compare__bar">
            <span className="compare__state" aria-live="polite">{awrex ? 'The AWREX textile approach' : 'Conventional approach'}</span>
            <button className="switch" role="switch" aria-checked={awrex} onClick={() => setAwrex(a => !a)}>
              <span>Show the AWREX way</span><span className="switch__track" aria-hidden="true" />
            </button>
          </div>
          {ROWS.map(([title, oldText, newText]) => (
            <div className="compare__row" key={title}>
              <h3>{title}</h3>
              <div className="compare__cell">
                <span className="old"><b className="mark">✕</b>{oldText}</span>
                <span className="new"><b className="mark">✓</b>{newText}</span>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
