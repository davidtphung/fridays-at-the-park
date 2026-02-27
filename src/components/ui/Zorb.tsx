/**
 * Zorb — A glossy black sphere icon used as the site's logo mark.
 * Inspired by Zora's zorb but rendered as a dark glass orb to match
 * the Fridays at the Park brand (black/dark aesthetic).
 */
export function Zorb({ size = 24, className = '' }: { size?: number; className?: string }) {
  const id = `zorb-${size}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`${id}-bg`} cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#555" />
          <stop offset="40%" stopColor="#222" />
          <stop offset="100%" stopColor="#000" />
        </radialGradient>
        <radialGradient id={`${id}-shine`} cx="30%" cy="25%" r="35%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.45)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>
      <circle cx="16" cy="16" r="15" fill={`url(#${id}-bg)`} stroke="#444" strokeWidth="0.5" />
      <circle cx="16" cy="16" r="15" fill={`url(#${id}-shine)`} />
      <circle cx="11" cy="11" r="3.5" fill="rgba(255,255,255,0.12)" />
    </svg>
  );
}
