import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Icons.jsx';

const LINKS = [
  ['problem', 'Why textiles'],
  ['platform', 'Platform'],
  ['experience', 'Experience'],
  ['products', 'Products'],
  ['trust', 'Your data'],
];

export default function Nav() {
  const { pathname } = useLocation();
  const onHome = pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState('');

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  // highlight the section currently on screen
  useEffect(() => {
    setCurrent('');
    if (!onHome || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) setCurrent(e.target.id); }), { rootMargin: '-45% 0px -50% 0px' });
    LINKS.forEach(([id]) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, [onHome]);

  const close = () => setOpen(false);

  return (
    <header className={`nav${scrolled || !onHome ? ' is-scrolled' : ''}`}>
      <div className="wrap nav__in">
        <Link className="brand" to="/" aria-label="AWREX home" onClick={close}><Logo />AWREX</Link>
        <button className="burger" aria-label="Menu" aria-expanded={open} aria-controls="menu" onClick={() => setOpen(o => !o)}>
          <span /><span /><span />
        </button>
        <nav className={`nav__links${open ? ' open' : ''}`} id="menu" aria-label="Main">
          {LINKS.map(([id, label]) => (
            <Link key={id} to={`/#${id}`} aria-current={current === id ? 'true' : undefined} onClick={close}>{label}</Link>
          ))}
          <Link className="btn btn--primary" to="/#contact" onClick={close}>Get in touch</Link>
        </nav>
      </div>
    </header>
  );
}
