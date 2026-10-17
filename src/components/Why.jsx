import { Reveal } from '../hooks/useReveal.jsx';
import { IconPulse, IconRefresh, IconGrid } from './Icons.jsx';

const CARDS = [
  [IconPulse, '', 'Textile-native bioelectronics', 'Engineered conductive yarns and nanofiber-based materials create stable, low-impedance skin interfaces for physiological signal acquisition.'],
  [IconRefresh, 'icon--rose', 'Washable & reusable', 'Conformable, skin-compatible products designed for extended use, without compromising the properties of the textile.'],
  [IconGrid, 'icon--purple', 'Modular & material-agnostic', 'One architecture supports biosignal sensing, controlled thermal therapy and future multimodal sensing in scalable textile manufacturing.'],
];

export default function Why() {
  return (
    <section className="section" id="why">
      <div className="wrap">
        <Reveal className="sec-head sec-head--center">
          <span className="kicker">What makes it different</span>
          <h2>The textile <em>is</em> the sensor</h2>
          <p>Unlike device-on-textile approaches, we engineer conductivity, sensing, interconnection and thermal function into the fabric architecture itself.</p>
        </Reveal>
        <div className="cards3">
          {CARDS.map(([Icon, cls, title, text]) => (
            <Reveal as="article" className="card" key={title}>
              <div className={`icon ${cls}`.trim()}><Icon /></div>
              <h3>{title}</h3>
              <p>{text}</p>
            </Reveal>
          ))}
        </div>
        <Reveal as="p" className="quote">One technology platform. <span>Multiple product possibilities.</span></Reveal>
      </div>
    </section>
  );
}
