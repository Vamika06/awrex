import { useRef } from 'react';

/** Arrow / Home / End keyboard support for a row of tabs (roving tabindex). */
export function useTabKeys(count, setActive) {
  const refs = useRef([]);
  const onKeyDown = (e, i) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    let n = null;
    if (step) n = (i + step + count) % count;
    if (e.key === 'Home') n = 0;
    if (e.key === 'End') n = count - 1;
    if (n !== null) { e.preventDefault(); setActive(n); refs.current[n]?.focus(); }
  };
  return { refs, onKeyDown };
}
