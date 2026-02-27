import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
        }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32">
          <defs>
            <radialGradient id="zorb" cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#444" />
              <stop offset="40%" stopColor="#1a1a1a" />
              <stop offset="100%" stopColor="#000" />
            </radialGradient>
            <radialGradient id="shine" cx="30%" cy="25%" r="35%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.45)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
          </defs>
          <circle cx="16" cy="16" r="15" fill="url(#zorb)" stroke="#333" strokeWidth="0.5" />
          <circle cx="16" cy="16" r="15" fill="url(#shine)" />
          <circle cx="11" cy="11" r="3.5" fill="rgba(255,255,255,0.12)" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
