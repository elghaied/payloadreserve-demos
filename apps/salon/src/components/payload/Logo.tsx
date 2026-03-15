import React from 'react'

export default function Logo() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '20px 0',
      }}
    >
      {/* Sparkle icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        width="36"
        height="36"
        aria-hidden="true"
      >
        <path
          d="M16 2 L19 13 L30 16 L19 19 L16 30 L13 19 L2 16 L13 13 Z"
          fill="#C4A35A"
        />
      </svg>
      <span
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: '28px',
          fontWeight: 600,
          letterSpacing: '0.02em',
          color: 'var(--theme-elevation-1000)',
        }}
      >
        Lumière Salon
      </span>
    </div>
  )
}
