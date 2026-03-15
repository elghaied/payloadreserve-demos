import React from 'react'

const EVENT_COLORS = ['#e53e3e', '#d69e2e', '#3182ce', '#805ad5', '#38a169', '#dd6b20']

export default function Icon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width="24"
      height="24"
      aria-hidden="true"
    >
      <rect width="32" height="32" fill="var(--theme-elevation-800)" rx="0" />
      {/* Color stripe */}
      {EVENT_COLORS.map((color, i) => (
        <rect key={i} x={i * 5.33} y="0" width="5.34" height="3" fill={color} />
      ))}
      <text
        x="16"
        y="23"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontSize="18"
        fontWeight="900"
        fill="var(--theme-elevation-0)"
      >
        É
      </text>
    </svg>
  )
}
