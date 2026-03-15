import React from 'react'

export default function Logo() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        padding: '24px 0',
      }}
    >
      {/* Botanical leaf mark */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        width="56"
        height="56"
        aria-hidden="true"
      >
        {/* Circular frame */}
        <circle cx="32" cy="32" r="30" fill="none" stroke="#d4a574" strokeWidth="0.75" opacity="0.4" />
        <circle cx="32" cy="32" r="27" fill="none" stroke="#d4a574" strokeWidth="0.4" opacity="0.2" />
        {/* Golden leaf */}
        <path
          d="M32 10 C22 18, 18 30, 32 54 C46 30, 42 18, 32 10Z"
          fill="#d4a574"
          opacity="0.85"
        />
        {/* Central vein */}
        <path
          d="M32 14 L32 48"
          stroke="#1a0a14"
          strokeWidth="0.7"
          fill="none"
          opacity="0.3"
        />
        {/* Side veins */}
        <path d="M32 22 C29 25, 26 27, 24 27.5" stroke="#1a0a14" strokeWidth="0.5" fill="none" opacity="0.25" />
        <path d="M32 28 C35 31, 38 33, 40 33.5" stroke="#1a0a14" strokeWidth="0.5" fill="none" opacity="0.25" />
        <path d="M32 34 C29 37, 27 39, 25.5 39.5" stroke="#1a0a14" strokeWidth="0.5" fill="none" opacity="0.25" />
        <path d="M32 40 C34 42, 36 43, 37 43.5" stroke="#1a0a14" strokeWidth="0.5" fill="none" opacity="0.25" />
        {/* Rosé bud at tip */}
        <circle cx="32" cy="12" r="1.8" fill="#c4758a" opacity="0.7" />
      </svg>

      {/* Restaurant name */}
      <span
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: '30px',
          fontWeight: 500,
          fontStyle: 'italic',
          letterSpacing: '0.04em',
          color: 'var(--theme-elevation-1000)',
          lineHeight: 1,
        }}
      >
        Le Jardin Doré
      </span>

      {/* Divider with rosé dot */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '32px', height: '1px', background: 'linear-gradient(to right, transparent, #d4a574)' }} />
        <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#c4758a', opacity: 0.6 }} />
        <div style={{ width: '32px', height: '1px', background: 'linear-gradient(to left, transparent, #d4a574)' }} />
      </div>

      {/* Tagline */}
      <span
        style={{
          fontFamily: "'Outfit', system-ui, sans-serif",
          fontSize: '9px',
          letterSpacing: '0.3em',
          textTransform: 'uppercase' as const,
          color: '#d4a574',
          opacity: 0.7,
        }}
      >
        Paris · Est. 1987
      </span>
    </div>
  )
}
