import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';

/** Fades/slides an element in the first time it scrolls into view. */
export const Reveal = forwardRef(function Reveal({ as: Tag = 'div', className = '', children, ...rest }, fwd) {
  const inner = useRef(null);
  const [shown, setShown] = useState(false);
  const setRef = useCallback(el => {
    inner.current = el;
    if (typeof fwd === 'function') fwd(el); else if (fwd) fwd.current = el;
  }, [fwd]);
  useEffect(() => {
    const el = inner.current;
    if (!el || !('IntersectionObserver' in window)) { setShown(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <Tag ref={setRef} className={`reveal${shown ? ' in' : ''} ${className}`.trim()} {...rest}>{children}</Tag>;
});

/** Pauses canvas animation while the element is off-screen. Returns a ref-held boolean. */
export function useVisibleRef(elRef) {
  const visible = useRef(true);
  useEffect(() => {
    const el = elRef.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([e]) => { visible.current = e.isIntersecting; });
    io.observe(el);
    return () => io.disconnect();
  }, [elRef]);
  return visible;
}
