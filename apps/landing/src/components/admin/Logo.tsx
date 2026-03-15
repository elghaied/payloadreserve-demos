import React from 'react'

export default function Logo() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        padding: '20px 0',
      }}
    >
      {/* Simplified calendar icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        width="48"
        height="48"
        aria-hidden="true"
      >
        {/* Calendar pins */}
        <rect x="15" y="2" width="3" height="12" rx="1.5" fill="#7C3AED" opacity="0.7" />
        <rect x="30" y="2" width="3" height="12" rx="1.5" fill="#7C3AED" opacity="0.7" />
        {/* Calendar body */}
        <rect x="2" y="10" width="44" height="36" rx="6" fill="#1C1917" stroke="#5B21B6" strokeWidth="1.5" />
        {/* Header bar */}
        <rect x="2" y="10" width="44" height="12" rx="6" fill="#5B21B6" />
        <rect x="2" y="16" width="44" height="6" fill="#5B21B6" />
        {/* Header text */}
        <text x="24" y="20" textAnchor="middle" fontFamily="'Courier New', monospace" fontSize="6" fontWeight="700" fill="white" letterSpacing="2">RESERVE</text>
        {/* Grid dots representing days */}
        <circle cx="12" cy="30" r="1.5" fill="#78716C" opacity="0.4" />
        <circle cx="20" cy="30" r="1.5" fill="#78716C" opacity="0.4" />
        <circle cx="28" cy="30" r="1.5" fill="#78716C" opacity="0.4" />
        <circle cx="36" cy="30" r="1.5" fill="#78716C" opacity="0.4" />
        <circle cx="12" cy="37" r="1.5" fill="#78716C" opacity="0.4" />
        <circle cx="20" cy="37" r="1.5" fill="#78716C" opacity="0.4" />
        {/* Highlighted "booked" day */}
        <rect x="25" y="34" width="6" height="6" rx="2" fill="#5B21B6" opacity="0.9" />
        <rect x="33" y="34" width="6" height="6" rx="2" fill="#5B21B6" opacity="0.4" />
      </svg>

      {/* Brand name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
        <span
          style={{
            fontFamily: "'DM Mono', 'Courier New', monospace",
            fontSize: '16px',
            fontWeight: 600,
            color: 'var(--theme-elevation-1000)',
            letterSpacing: '-0.02em',
          }}
        >
          payload
        </span>
        <span
          style={{
            fontFamily: "'DM Mono', 'Courier New', monospace",
            fontSize: '16px',
            fontWeight: 600,
            color: '#7C3AED',
            letterSpacing: '-0.02em',
          }}
        >
          -reserve
        </span>
      </div>
    </div>
  )
}
