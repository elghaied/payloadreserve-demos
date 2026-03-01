'use client'

import Link from 'next/link'

export default function DemoDashboardNavLink() {
  return (
    <Link
      href="/admin/demo-dashboard"
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '4px 16px',
        fontSize: '13px',
        fontWeight: 500,
        color: 'var(--theme-text)',
        textDecoration: 'none',
      }}
    >
      Demo Dashboard
    </Link>
  )
}
