import React from 'react'

export default function Logo() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        padding: '20px 0',
      }}
    >
      {/* Gold accent line */}
      <div style={{ width: '60px', height: '1px', backgroundColor: '#d4a574', opacity: 0.6 }} />
      {/* Rosé ornament */}
      <span style={{ color: '#c4758a', fontSize: '14px', letterSpacing: '8px' }}>✦</span>
      <span
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: '28px',
          fontWeight: 500,
          fontStyle: 'italic',
          letterSpacing: '0.05em',
          color: 'var(--theme-elevation-1000)',
        }}
      >
        Le Jardin Doré
      </span>
      <span
        style={{
          fontFamily: "'Outfit', system-ui, sans-serif",
          fontSize: '10px',
          letterSpacing: '0.25em',
          textTransform: 'uppercase' as const,
          color: '#d4a574',
        }}
      >
        Est. 1987
      </span>
      {/* Gold accent line */}
      <div style={{ width: '60px', height: '1px', backgroundColor: '#d4a574', opacity: 0.6 }} />
    </div>
  )
}
