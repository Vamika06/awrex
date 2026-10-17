import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { IconHand } from './Icons.jsx';

const GAP = 26;
const TEAL = '18,133,122';
const g = (a, c, w, u) => a * Math.exp(-(((u - c) / w) ** 2));
const beat = u => g(.12, .18, .035, u) + g(-.12, .39, .012, u) + g(1, .42, .012, u) + g(-.25, .45, .014, u) + g(.26, .68, .06, u);

/** Woven fabric canvas: threads light up near the cursor, a simulated ECG trace sweeps across. */
function FabricCanvas({ hostRef }) {
  const cvRef = useRef(null);

  useEffect(() => {
    const cv = cvRef.current, host = hostRef.current;
    const ctx = cv.getContext('2d');
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W = 0, H = 0, dpr = 1, base = null, visible = true, raf = 0;
    const mouse = { x: -999, y: -999, on: false };

    function buildBase() {
      base = document.createElement('canvas');
      base.width = W * dpr; base.height = H * dpr;
      const b = base.getContext('2d');
      b.scale(dpr, dpr); b.lineWidth = 2; b.lineCap = 'round'; b.strokeStyle = 'rgba(15,27,45,.06)';
      const cols = Math.ceil(W / GAP) + 1, rows = Math.ceil(H / GAP) + 1, gap = 5;
      for (let j = 0; j < rows; j++) {
        const y = j * GAP; let x0 = 0; b.beginPath();
        for (let i = 0; i < cols; i++) if ((i + j) % 2 === 0) { const x = i * GAP; b.moveTo(x0, y); b.lineTo(x - gap, y); x0 = x + gap; }
        b.moveTo(x0, y); b.lineTo(W, y); b.stroke();
      }
      for (let i = 0; i < cols; i++) {
        const x = i * GAP; let y0 = 0; b.beginPath();
        for (let j = 0; j < rows; j++) if ((i + j) % 2 === 1) { const y = j * GAP; b.moveTo(x, y0); b.lineTo(x, y - gap); y0 = y + gap; }
        b.moveTo(x, y0); b.lineTo(x, H); b.stroke();
      }
    }

    function draw(t) {
      if (!base) return;
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(base, 0, 0, W, H);

      if (mouse.on && !reduce) {
        const R = 150;
        ctx.lineWidth = 2.4; ctx.lineCap = 'round';
        for (let j = Math.floor((mouse.y - R) / GAP); j <= Math.ceil((mouse.y + R) / GAP); j++) {
          const y = j * GAP, dy = Math.abs(y - mouse.y); if (dy >= R) continue;
          const half = Math.sqrt(R * R - dy * dy), a = 1 - dy / R;
          ctx.strokeStyle = `rgba(${TEAL},${.55 * a})`;
          ctx.beginPath(); ctx.moveTo(mouse.x - half, y); ctx.lineTo(mouse.x + half, y); ctx.stroke();
        }
        for (let i = Math.floor((mouse.x - R) / GAP); i <= Math.ceil((mouse.x + R) / GAP); i++) {
          const x = i * GAP, dx = Math.abs(x - mouse.x); if (dx >= R) continue;
          const half = Math.sqrt(R * R - dx * dx), a = 1 - dx / R;
          ctx.strokeStyle = `rgba(47,127,209,${.5 * a})`;
          ctx.beginPath(); ctx.moveTo(x, mouse.y - half); ctx.lineTo(x, mouse.y + half); ctx.stroke();
        }
      }

      const wide = W > 900, L = 250, speed = 270, amp = wide ? 62 : 40, tail = 460;
      const baseY = wide ? H * .5 : H * .94, x0 = wide ? W * .5 : 0;
      const head = reduce ? W * .8 : x0 + ((t / 1000) * speed) % (W - x0 + tail + 40);
      ctx.lineWidth = 2.6; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      let px = null, py = null;
      for (let x = Math.max(x0, head - tail); x <= Math.min(W, head); x += 3) {
        const y = baseY - beat((((x % L) + L) % L) / L) * amp;
        if (px !== null) {
          const a = reduce ? .8 : (x - (head - tail)) / tail;
          ctx.strokeStyle = `rgba(224,85,107,${.85 * a})`;
          ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(x, y); ctx.stroke();
        }
        px = x; py = y;
      }
      if (px !== null && !reduce) {
        const grad = ctx.createRadialGradient(px, py, 0, px, py, 22);
        grad.addColorStop(0, 'rgba(224,85,107,.55)'); grad.addColorStop(1, 'rgba(224,85,107,0)');
        ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(px, py, 22, 0, 7); ctx.fill();
        ctx.fillStyle = '#e0556b'; ctx.beginPath(); ctx.arc(px, py, 4.5, 0, 7); ctx.fill();
      }
    }

    function resize() {
      const r = cv.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width; H = r.height;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildBase(); draw(performance.now());
    }

    const loop = t => { if (visible) draw(t); raf = requestAnimationFrame(loop); };
    const move = e => { const r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.on = true; };
    const leave = () => { mouse.on = false; };

    host.addEventListener('pointermove', move);
    host.addEventListener('pointerleave', leave);
    const ro = new ResizeObserver(resize); ro.observe(cv);
    const io = 'IntersectionObserver' in window ? new IntersectionObserver(e => { visible = e[0].isIntersecting; }) : null;
    io?.observe(host);
    resize();
    if (!reduce) raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io?.disconnect();
      host.removeEventListener('pointermove', move); host.removeEventListener('pointerleave', leave);
    };
  }, [hostRef]);

  return <canvas className="hero__canvas" ref={cvRef} aria-hidden="true" />;
}

const CHIPS = [
  ['health', 'Healthcare', 'c-health'],
  ['wellness', 'Wellness & Therapy', 'c-wellness'],
  ['sports', 'Sports & Fitness', 'c-sports'],
  ['home', 'Home Care', 'c-home'],
];

export default function Hero({ onPickProduct }) {
  const hostRef = useRef(null);
  return (
    <section className="hero" id="top" ref={hostRef}>
      <FabricCanvas hostRef={hostRef} />
      <div className="wrap hero__in">
        <span className="eyebrow"><i /> AWREX Technologies Pvt. Ltd.</span>
        <h1>Engineering <em>Smart Textiles</em> for a Healthier, More Connected World</h1>
        <p className="lead">We are developing advanced conductive textile technologies that bring sensing, physiological monitoring, and controlled warmth into the fabrics we wear and use every day.</p>
        <div className="hero__cta">
          <Link className="btn btn--primary" to="/#experience">Try the fabric →</Link>
          <Link className="btn btn--ghost" to="/#platform">See the platform</Link>
        </div>
        <div className="hero__chips" aria-label="Product areas">
          {CHIPS.map(([key, label, cls]) => (
            <Link key={key} className={`chip ${cls}`} to="/#products" onClick={() => onPickProduct(key)}>{label}</Link>
          ))}
        </div>
      </div>
      <div className="hero__hint" aria-hidden="true"><IconHand /> Move your cursor across the fabric</div>
    </section>
  );
}
