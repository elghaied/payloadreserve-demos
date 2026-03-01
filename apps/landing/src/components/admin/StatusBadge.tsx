'use client'

import type { DefaultCellComponentProps } from 'payload'

const COLORS: Record<string, { bg: string; text: string }> = {
  ready: { bg: '#dcfce7', text: '#166534' },
  completed: { bg: '#dcfce7', text: '#166534' },
  provisioning: { bg: '#fef3c7', text: '#92400e' },
  submitted: { bg: '#dbeafe', text: '#1e40af' },
  failed: { bg: '#fee2e2', text: '#991b1b' },
  rejected: { bg: '#fee2e2', text: '#991b1b' },
  expired: { bg: '#f3f4f6', text: '#4b5563' },
}

export default function StatusBadge({ cellData }: DefaultCellComponentProps) {
  const value = cellData as string | undefined
  if (!value) return null

  const colors = COLORS[value] ?? { bg: '#f3f4f6', text: '#4b5563' }

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: 600,
        lineHeight: '18px',
        backgroundColor: colors.bg,
        color: colors.text,
      }}
    >
      {value}
    </span>
  )
}
