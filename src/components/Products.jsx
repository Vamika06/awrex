import { Reveal } from '../hooks/useReveal.jsx';
import { useTabKeys } from '../hooks/useTabKeys.js';

const FAMILIES = [
  { key: 'health', cls: 't-health', tab: 'Healthcare', badge: 'Neonatal → Geriatric', title: 'Healthcare monitoring',
    text: 'Textile electrodes that hold stable skin contact for hours or days, without adhesive patches or trailing wires, in reusable and washable garments.',
    items: ['ECG smart shirts', 'Respiration bands', 'EMG sleeves', 'Smart bed / monitoring mats'] },
  { key: 'wellness', cls: 't-wellness', tab: 'Wellness & Therapy', badge: 'B2C / D2C', title: 'Wellness & therapy',
    text: 'Controlled warmth that conforms to the body instead of relying on a rigid, separate device, for everyday comfort and relief.',
    items: ['Period-pain heating pad', 'Back warmer', 'Neck / shoulder wrap', 'Joint sleeves'] },
  { key: 'sports', cls: 't-sports', tab: 'Sports & Fitness', badge: 'B2B / B2C', title: 'Sports & fitness',
    text: 'Garments that follow muscle activity, posture and movement while you train, and support recovery afterwards.',
    items: ['EMG performance sleeves', 'Smart training shirts', 'Posture / motion textiles', 'Recovery wraps'] },
  { key: 'home', cls: 't-home', tab: 'Home Care', badge: 'Connected', title: 'Home care',
    text: 'Textiles in the home that connect people with the carers who look after them, with remote monitoring through an app and data platform.',
    items: ['Bed textiles', 'Remote monitoring', 'Caregiver connectivity'] },
];

export default function Products({ activeKey, setActiveKey }) {
  const idx = Math.max(0, FAMILIES.findIndex(f => f.key === activeKey));
  const { refs, onKeyDown } = useTabKeys(FAMILIES.length, i => setActiveKey(FAMILIES[i].key));
  const f = FAMILIES[idx];
  return (
    <section className="section section--soft" id="products">
      <div className="wrap">
        <Reveal className="sec-head">
          <span className="kicker">Product families</span>
          <h2>One conductive-textile engine, multiple markets</h2>
          <p>The modular architecture adapts quickly to healthcare, rehabilitation, sports and wellness needs. These are the product directions we are developing.</p>
        </Reveal>

        <Reveal>
          <div className="tabs" role="tablist" aria-label="Product families">
            {FAMILIES.map((x, i) => (
              <button key={x.key} ref={el => (refs.current[i] = el)} className={`tab ${x.cls}`} role="tab" id={`pt-${x.key}`}
                aria-controls={`pp-${x.key}`} aria-selected={i === idx} tabIndex={i === idx ? 0 : -1}
                onClick={() => setActiveKey(x.key)} onKeyDown={e => onKeyDown(e, i)}>
                <i />{x.tab}
              </button>
            ))}
          </div>
          <div className={`pane ${f.cls}`} role="tabpanel" id={`pp-${f.key}`} aria-labelledby={`pt-${f.key}`} key={f.key}>
            <div>
              <span className="badge">{f.badge}</span>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
            <ul className="prod-list">{f.items.map(i => <li key={i}>{i}</li>)}</ul>
          </div>
          <p className="prod-note">Products shown are under development and are not yet available for sale.</p>
        </Reveal>
      </div>
    </section>
  );
}
