export const Logo = () => (
  <svg viewBox="0 0 64 64" aria-hidden="true">
    <rect width="64" height="64" rx="16" fill="#12857a" />
    <path d="M8 34h13l6-16 8 28 6-12h15" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Svg = ({ children }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
);

export const IconPulse = () => <Svg><path d="M3 12h4l3-8 4 16 3-8h4" /></Svg>;
export const IconRefresh = () => <Svg><path d="M20 12a8 8 0 1 1-3-6.2" /><path d="M20 4v5h-5" /></Svg>;
export const IconGrid = () => <Svg><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></Svg>;
export const IconLock = () => <Svg><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></Svg>;
export const IconLayers = () => <Svg><path d="M12 3l9 5-9 5-9-5 9-5z" /><path d="M3 13l9 5 9-5" /></Svg>;
export const IconShield = () => <Svg><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" /><path d="M9 12l2 2 4-4" /></Svg>;
export const IconKey = () => <Svg><circle cx="8" cy="15" r="3.5" /><path d="M10.5 12.5L20 3M16 7l3 3" /></Svg>;
export const IconMail = () => <Svg><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></Svg>;
export const IconHand = () => <Svg><path d="M9 11V5a2 2 0 0 1 4 0v6" /><path d="M13 11V9a2 2 0 0 1 4 0v5a6 6 0 0 1-6 6h-1a6 6 0 0 1-5-3l-2-4a2 2 0 0 1 3-2l1 1" /></Svg>;
