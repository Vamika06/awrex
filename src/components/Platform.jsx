import { useState } from 'react';
import { Reveal } from '../hooks/useReveal.jsx';
import { useTabKeys } from '../hooks/useTabKeys.js';

const Mini = ({ title, text, kind = '' }) => (
  <div className={`mini ${kind}`.trim()}><h4>{title}</h4><p>{text}</p></div>
);

const STEPS = [
  {
    label: 'Conductive materials',
    body: (
      <>
        <h3>Conductive materials</h3>
        <p>Engineered conductive yarns and functional nanofiber-based materials form the foundation. Because the platform is material-agnostic, the same architecture works across different base fibres and conductive systems.</p>
        <div className="mini-grid">
          <Mini title="Textile yarn" text="Cotton, polyester, nylon, blended" />
          <Mini title="Conductive coatings" text="Ag, Cu, carbon" />
          <Mini title="Nanomaterials" text="MWCNT, graphene" />
          <Mini title="Conductive polymers" text="PANI, PEDOT:PSS" />
        </div>
      </>
    ),
  },
  {
    label: 'Smart textile structure',
    body: (
      <>
        <h3>Smart textile structure</h3>
        <p>Conductivity, sensing, interconnection and thermal functionality are engineered into the textile architecture itself, so the fabric stays conformable, washable and reusable. Nanofiber coatings enhance the surface that touches the skin.</p>
        <div className="tag-row">{['Weave', 'Knit', 'Braid', 'Embroider', 'Coated'].map(t => <span className="tag" key={t}>{t}</span>)}</div>
      </>
    ),
  },
  {
    label: 'Functional textiles',
    body: (
      <>
        <h3>Functional textiles: sensing + heating</h3>
        <p>The same textile can read the body and respond to it.</p>
        <div className="mini-grid">
          <Mini kind="mini--sense" title="ECG" text="Cardiac activity" />
          <Mini kind="mini--sense" title="EMG" text="Muscle activity" />
          <Mini kind="mini--sense" title="Respiration" text="Breathing rate" />
          <Mini kind="mini--sense" title="Motion / strain" text="Movement and posture" />
          <Mini kind="mini--sense" title="Pressure" text="Contact and load" />
          <Mini kind="mini--sense" title="Temperature" text="Body or skin" />
          <Mini kind="mini--heat" title="Body warmth" text="Maintaining temperature in cold conditions" />
          <Mini kind="mini--heat" title="Cramp relief" text="Menstrual cramp relief" />
          <Mini kind="mini--heat" title="Joint comfort" text="Joint stiffness relief" />
        </div>
      </>
    ),
  },
  {
    label: 'Connected products',
    body: (
      <>
        <h3>Connected products</h3>
        <p>Textile structures are combined with flexible electronics, wireless connectivity and data analytics to deliver personalised wearable and monitoring products.</p>
        <div className="mini-grid">
          <Mini title="Smart garments" text="Shirt, sportswear, innerwear" />
          <Mini title="Textile-based wearables" text="Patch, belt, sleeve" />
          <Mini title="Smart monitoring systems" text="Home and clinical use" />
          <Mini title="Wireless connectivity" text="App and data platform" />
        </div>
      </>
    ),
  },
];

export default function Platform() {
  const [active, setActive] = useState(0);
  const { refs, onKeyDown } = useTabKeys(STEPS.length, setActive);
  return (
    <section className="section section--soft" id="platform">
      <div className="wrap">
        <Reveal className="sec-head sec-head--center">
          <span className="kicker">The platform</span>
          <h2>From conductive materials to intelligent textile products</h2>
          <p>One core material platform that enables sensing, monitoring and therapeutic warmth across multiple product families.</p>
        </Reveal>

        <Reveal>
          <div className="steps" role="tablist" aria-label="Platform stages">
            <div className="steps__fill" style={{ width: `${(active / 3) * 75}%` }} />
            {STEPS.map((s, i) => (
              <button key={s.label} ref={el => (refs.current[i] = el)} className={`step${i < active ? ' is-done' : ''}`}
                role="tab" id={`st${i}`} aria-controls={`sp${i}`} aria-selected={i === active} tabIndex={i === active ? 0 : -1}
                onClick={() => setActive(i)} onKeyDown={e => onKeyDown(e, i)}>
                <span className="step__n">{i + 1}</span><span className="step__t">{s.label}</span>
              </button>
            ))}
          </div>
          <div className="step-panel" role="tabpanel" id={`sp${active}`} aria-labelledby={`st${active}`} key={active}>
            {STEPS[active].body}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
