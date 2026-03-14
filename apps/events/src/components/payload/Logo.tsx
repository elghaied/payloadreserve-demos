import React from 'react'

const EVENT_COLORS = ['#e53e3e', '#d69e2e', '#3182ce', '#805ad5', '#38a169', '#dd6b20']

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
      {/* Color stripe */}
      <div style={{ display: 'flex', width: '120px', height: '4px' }}>
        {EVENT_COLORS.map((color, i) => (
          <div key={i} style={{ flex: 1, backgroundColor: color }} />
        ))}
      </div>
      <span
        style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: '32px',
          fontWeight: 900,
          letterSpacing: '-2px',
          textTransform: 'uppercase' as const,
          color: 'var(--theme-elevation-1000)',
        }}
      >
        ÉCLAT
      </span>
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '9px',
          letterSpacing: '3px',
          textTransform: 'uppercase' as const,
          color: 'var(--theme-elevation-500)',
        }}
      >
        Centre Culturel
      </span>
      {/* Color stripe */}
      <div style={{ display: 'flex', width: '120px', height: '4px' }}>
        {EVENT_COLORS.map((color, i) => (
          <div key={i} style={{ flex: 1, backgroundColor: color }} />
        ))}
      </div>
    </div>
  )
}
