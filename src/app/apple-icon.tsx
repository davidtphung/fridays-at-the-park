import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000',
          borderRadius: 40,
        }}
      >
        <svg width="140" height="140" viewBox="0 0 140 140">
          <defs>
            <radialGradient id="zorb-a" cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#555" />
              <stop offset="40%" stopColor="#222" />
              <stop offset="100%" stopColor="#000" />
            </radialGradient>
            <radialGradient id="shine-a" cx="30%" cy="25%" r="35%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
          </defs>
          <circle cx="70" cy="70" r="65" fill="url(#zorb-a)" stroke="#444" strokeWidth="1" />
          <circle cx="70" cy="70" r="65" fill="url(#shine-a)" />
          <circle cx="48" cy="48" r="14" fill="rgba(255,255,255,0.1)" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
