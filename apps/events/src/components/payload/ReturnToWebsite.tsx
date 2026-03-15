'use client'
import React, { useEffect, useState } from 'react'

const EVENT_COLORS = ['#e53e3e', '#d69e2e', '#3182ce', '#805ad5', '#38a169', '#dd6b20']

const BAR_HEIGHT = '36px'

const baseBarStyle: React.CSSProperties = {
  height: BAR_HEIGHT,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 16px',
  fontSize: '13px',
  fontFamily: "'Inter', system-ui, sans-serif",
  zIndex: 10000,
  position: 'sticky',
  top: 0,
}

export default function ReturnToWebsite({ children }: { children: React.ReactNode }) {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || '/'
  const [hostname, setHostname] = useState('')

  useEffect(() => {
    setHostname(window.location.hostname)
  }, [])

  return (
    <div>
      <div
        className="return-to-website-bar"
        style={{
          ...baseBarStyle,
          backgroundColor: '#000000',
          color: '#FFFFFF',
        }}
      >
        <a
          href={serverUrl}
          style={{
            color: 'inherit',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '10px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
          }}
        >
          ← BACK TO ÉCLAT
        </a>
        {hostname && (
          <span style={{ opacity: 0.5, fontSize: '10px', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '1px' }}>
            {hostname}
          </span>
        )}
      </div>
      {/* Color stripe below bar */}
      <div style={{ display: 'flex', width: '100%', height: '3px' }}>
        {EVENT_COLORS.map((color, i) => (
          <div key={i} style={{ flex: 1, backgroundColor: color }} />
        ))}
      </div>
      {children}
    </div>
  )
}
