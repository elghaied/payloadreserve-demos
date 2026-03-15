'use client'
import React, { useEffect, useState } from 'react'

const BAR_HEIGHT = '36px'

const baseBarStyle: React.CSSProperties = {
  height: BAR_HEIGHT,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 16px',
  fontSize: '13px',
  fontFamily: "'Outfit', system-ui, sans-serif",
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
          backgroundColor: '#5B21B6',
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
          }}
        >
          ← Back to payload-reserve
        </a>
        {hostname && (
          <span style={{ opacity: 0.7, fontSize: '12px' }}>{hostname}</span>
        )}
      </div>
      {children}
    </div>
  )
}
