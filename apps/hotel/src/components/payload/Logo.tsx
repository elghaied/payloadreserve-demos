import React from 'react'

export default function Logo() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        padding: '20px 0',
      }}
    >
      {/* GH Monogram with Art Deco frame */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 80 80"
        width="72"
        height="72"
        aria-hidden="true"
      >
        {/* Outer diamond frame */}
        <rect
          x="16"
          y="16"
          width="48"
          height="48"
          rx="2"
          fill="none"
          stroke="#C47D5A"
          strokeWidth="1.5"
          transform="rotate(45 40 40)"
        />
        {/* Inner diamond frame */}
        <rect
          x="22"
          y="22"
          width="36"
          height="36"
          rx="1"
          fill="none"
          stroke="#C47D5A"
          strokeWidth="0.75"
          opacity="0.5"
          transform="rotate(45 40 40)"
        />
        {/* GH text */}
        <text
          x="40"
          y="46"
          textAnchor="middle"
          fontFamily="'Libre Baskerville', Georgia, serif"
          fontSize="22"
          fontWeight="700"
          letterSpacing="2"
          fill="#C47D5A"
        >
          GH
        </text>
      </svg>
      <span
        style={{
          fontFamily: "'Libre Baskerville', Georgia, serif",
          fontSize: '24px',
          fontWeight: 400,
          letterSpacing: '0.15em',
          textTransform: 'uppercase' as const,
          color: 'var(--theme-elevation-1000)',
        }}
      >
        Grand Hotel
      </span>
      <span
        style={{
          fontFamily: "'Geist Sans', system-ui, sans-serif",
          fontSize: '11px',
          letterSpacing: '0.3em',
          textTransform: 'uppercase' as const,
          color: '#C47D5A',
          opacity: 0.8,
        }}
      >
        Est. 1928
      </span>
    </div>
  )
}
