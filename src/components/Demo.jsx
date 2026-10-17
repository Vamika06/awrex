import { useEffect, useRef, useState } from 'react';
import { Reveal, useVisibleRef } from '../hooks/useReveal.jsx';

/* Every signal below is SIMULATED for illustration. */
const MODES = {
  ecg:  { name: 'ECG',          cls: 'm-ecg',  color: '#e0556b', unit: 'bpm',         label: 'Heart rate',     min: 50, max: 140, val: 72, fmt: v => `${v} bpm`,
          desc: 'Textile electrodes sit against the skin and pick up the heart’s electrical activity, with no gel patches or loose wires.' },
  resp: { name: 'Respiration',  cls: 'm-resp', color: '#2f7fd1', unit: 'breaths/min', label: 'Breathing rate', min: 8,  max: 30,  val: 14, fmt: v => `${v} /min`,
          desc: 'A textile band follows your breathing rate and pattern, comfortably, over long periods.' },
  emg:  { name: 'Muscle (EMG)', cls: 'm-emg',  color: '#6d44c4', unit: '% effort',    label: 'Muscle effort',  min: 0,  max: 100, val: 35, fmt: v => `${v}%`,
          desc: 'Sleeves with textile electrodes read muscle activity, useful for rehabilitation, training and recovery.' },
  heat: { name: 'Warmth',       cls: 'm-heat', color: '#d98a1f', unit: '% warmth',    label: 'Warmth level',   min: 0,  max: 100, val: 60, fmt: v => `${v}%`,
          desc: 'A conductive textile layer provides controlled warmth that conforms to the body, for cold conditions, cramps or stiff joints.' },
};
const ORDER = ['ecg', 'resp', 'emg', 'heat'];

const RATE = 100;   // samples per second
const PX = 2;       // pixels per sample
const g = (a, c, w, u) => a * Math.exp(-(((u - c) / w) ** 2));
const beat = u => g(.12, .18, .035, u) + g(-.12, .39, .012, u) + g(1, .42, .012, u) + g(-.25, .45, .014, u) + g(.26, .68, .06, u);

export default function Demo() {
  const [mode, setMode] = useState('ecg');
  const [val, setVal] = useState(MODES.ecg.val);
  const rootRef = useRef(null), cvRef = useRef(null), valueRef = useRef(null), glowRef = useRef(null);
  const visible = useVisibleRef(rootRef);
  // mutable simulation state lives in a ref so the animation loop never triggers React renders
  const sim = useRef({ mode: 'ecg', val: MODES.ecg.val, phase: 0, heat: 0.12, hist: [] });

  const select = m => {
    const s = sim.current;
    s.mode = m; s.val = MODES[m].val; s.phase = 0; s.heat = 0.12; s.hist.fill(0);
    setMode(m); setVal(MODES[m].val);
  };
  const onSlide = e => { const v = +e.target.value; sim.current.val = v; setVal(v); };

  useEffect(() => {
    const cv = cvRef.current, ctx = cv.getContext('2d');
    const s = sim.current;
    let W = 0, H = 0, acc = 0, last = performance.now(), raf = 0;

    const sample = dt => {
      if (s.mode === 'ecg')  { s.phase = (s.phase + dt * s.val / 60) % 1; return (beat(s.phase) - .15) * 1.5 + (Math.random() - .5) * .03; }
      if (s.mode === 'resp') { s.phase = (s.phase + dt * s.val / 60) % 1; return Math.sin(s.phase * 6.2832) * .75 + Math.sin(s.phase * 12.566 + 1) * .08; }
      if (s.mode === 'emg')  { s.phase += dt; const env = .06 + .94 * (s.val / 100) * (.65 + .35 * Math.abs(Math.sin(s.phase * 2.4))); return (Math.random() * 2 - 1) * env; }
      s.heat += (s.val / 100 - s.heat) * (1 - Math.exp(-dt / 1.6));   // warmth eases toward the chosen level
      return s.heat * 1.7 - .85;
    };

    const size = () => {
      const r = cv.getBoundingClientRect(), d = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width; H = r.height; cv.width = W * d; cv.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0);
      s.hist = new Array(Math.ceil(W / PX) + 2).fill(0);
    };

    const render = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = '#eef2f5'; ctx.lineWidth = 1; ctx.beginPath();
      for (let x = 0; x < W; x += 24) { ctx.moveTo(x, 0); ctx.lineTo(x, H); }
      for (let y = 0; y < H; y += 24) { ctx.moveTo(0, y); ctx.lineTo(W, y); }
      ctx.stroke();
      ctx.strokeStyle = MODES[s.mode].color; ctx.lineWidth = 2.4; ctx.lineJoin = 'round'; ctx.beginPath();
      s.hist.forEach((v, i) => { const x = i * PX, y = H / 2 - v * H * .4; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
      ctx.stroke();
      // big number + garment warmth glow
      if (valueRef.current) valueRef.current.textContent = s.mode === 'heat' ? Math.round(s.heat * 100) : s.val;
      if (glowRef.current) {
        const cur = +glowRef.current.getAttribute('opacity') || 0;
        glowRef.current.setAttribute('opacity', (s.mode === 'heat' ? s.heat * .95 : Math.max(0, cur - .05)).toFixed(2));
      }
    };

    const loop = now => {
      const dt = Math.min((now - last) / 1000, .1); last = now;
      if (visible.current) {
        acc += dt * RATE; let n = Math.floor(acc); acc -= n;
        while (n-- > 0) { s.hist.push(sample(1 / RATE)); s.hist.shift(); }
        render();
      }
      raf = requestAnimationFrame(loop);
    };

    const ro = new ResizeObserver(size); ro.observe(cv);
    size(); raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [visible]);

  const m = MODES[mode];
  const zoneProps = k => ({
    role: 'button', tabIndex: 0, onClick: () => select(k),
    onKeyDown: e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(k); } },
    className: `zone z-${k}${mode === k ? ' is-active' : ''}`,
  });

  return (
    <section className="section" id="experience">
      <div className="wrap">
        <Reveal className="sec-head">
          <span className="kicker">Experience it</span>
          <h2>Touch the garment</h2>
          <p>Select a zone on the shirt, or use the buttons, to see what a textile sensor or heating layer does. Then drag the slider to change the signal.</p>
        </Reveal>

        <Reveal className="demo" ref={rootRef}>
          <div className="demo__visual">
            <svg className="garment-svg" viewBox="0 0 320 400" role="group" aria-label="Smart shirt with four interactive zones">
              <defs>
                <pattern id="weave" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M0 4h8M4 0v8" stroke="#dbe4ea" strokeWidth="1" /></pattern>
                <radialGradient id="heatGlow"><stop offset="0" stopColor="#ff9a2e" stopOpacity=".95" /><stop offset="1" stopColor="#ff9a2e" stopOpacity="0" /></radialGradient>
              </defs>
              <path d="M110 30C125 58 195 58 210 30L275 60L305 140L262 160L245 125L245 360Q245 372 233 372L87 372Q75 372 75 360L75 125L58 160L15 140L45 60Z" fill="#f4f8fa" stroke="#cbd7df" strokeWidth="2.5" strokeLinejoin="round" />
              <path d="M110 30C125 58 195 58 210 30L275 60L305 140L262 160L245 125L245 360Q245 372 233 372L87 372Q75 372 75 360L75 125L58 160L15 140L45 60Z" fill="url(#weave)" />
              <ellipse ref={glowRef} cx="160" cy="268" rx="95" ry="75" fill="url(#heatGlow)" opacity="0" />

              <path className="thread" d="M132 122C132 200 150 260 154 322" />
              <path className="thread" d="M188 122C188 200 170 260 166 322" />
              <path className="thread" d="M92 200C100 260 140 300 150 322" />
              <path className="thread" d="M228 200C220 260 180 300 170 322" />

              <g {...zoneProps('ecg')} aria-label="ECG electrodes on the chest">
                <circle className="ring" cx="132" cy="112" r="15" /><circle className="ring" cx="188" cy="112" r="15" />
                <circle className="hit" cx="160" cy="112" r="50" />
                <circle className="shape" cx="132" cy="112" r="15" /><circle className="shape" cx="188" cy="112" r="15" />
                <path d="M124 112h5l3-7 4 14 3-7h5" fill="none" stroke="#e0556b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </g>

              <g {...zoneProps('resp')} aria-label="Respiration band around the ribs">
                <rect className="ring" x="76" y="178" width="168" height="26" rx="13" />
                <rect className="hit" x="76" y="170" width="168" height="42" />
                <rect className="shape" x="76" y="178" width="168" height="26" rx="13" />
                <path d="M96 191q8-9 16 0t16 0 16 0 16 0 16 0 16 0 16 0 16 0" fill="none" stroke="#2f7fd1" strokeWidth="2" strokeLinecap="round" />
              </g>

              <g {...zoneProps('emg')} aria-label="EMG muscle sensing sleeves">
                <rect className="ring" x="38" y="100" width="40" height="32" rx="12" transform="rotate(-24 58 116)" />
                <rect className="ring" x="242" y="100" width="40" height="32" rx="12" transform="rotate(24 262 116)" />
                <circle className="hit" cx="50" cy="116" r="34" /><circle className="hit" cx="270" cy="116" r="34" />
                <rect className="shape" x="38" y="100" width="40" height="32" rx="12" transform="rotate(-24 58 116)" />
                <rect className="shape" x="242" y="100" width="40" height="32" rx="12" transform="rotate(24 262 116)" />
                <path d="M46 118l8-8 4 8 8-8M254 110l8 8 4-8 8 8" fill="none" stroke="#6d44c4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </g>

              <g {...zoneProps('heat')} aria-label="Heating textile panel on the lower abdomen">
                <rect className="ring" x="116" y="236" width="88" height="64" rx="16" />
                <rect className="hit" x="110" y="230" width="100" height="76" />
                <rect className="shape" x="116" y="236" width="88" height="64" rx="16" />
                <path d="M138 252q-5 6 0 12t0 12M160 252q-5 6 0 12t0 12M182 252q-5 6 0 12t0 12" fill="none" stroke="#d98a1f" strokeWidth="2.4" strokeLinecap="round" />
              </g>

              <rect x="140" y="322" width="40" height="24" rx="7" fill="#0f1b2d" />
              <circle cx="152" cy="334" r="3" fill="#12857a" /><circle cx="162" cy="334" r="3" fill="#12857a" /><circle cx="172" cy="334" r="3" fill="#cbd7df" />
            </svg>
            <p className="demo__hint">Tap any zone on the shirt</p>
          </div>

          <div className="demo__panel">
            <div className="modes" role="tablist" aria-label="Choose a function">
              {ORDER.map(k => (
                <button key={k} className={`mode ${MODES[k].cls}`} role="tab" aria-selected={mode === k} tabIndex={mode === k ? 0 : -1} onClick={() => select(k)}>{MODES[k].name}</button>
              ))}
            </div>
            <div className="readout"><b ref={valueRef} /><span>{m.unit}</span></div>
            <p className="demo__desc">{m.desc}</p>
            <div className="scope"><canvas ref={cvRef} role="img" aria-label="Simulated signal trace" /></div>
            <div className="slider-row">
              <label htmlFor="demo-slider"><span>{m.label}</span><output>{m.fmt(val)}</output></label>
              <input id="demo-slider" type="range" min={m.min} max={m.max} value={val} onChange={onSlide} style={{ '--sc': m.color }} />
            </div>
            <p className="disclaimer">Simulated signals for illustration only. This is not real patient data and not a medical device.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
