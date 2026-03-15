import React from 'react'

export default function Icon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width="24"
      height="24"
      aria-hidden="true"
    >
      {/* Calendar pins */}
      <rect x="10" y="1" width="2.5" height="8" rx="1.25" fill="#7C3AED" opacity="0.7" />
      <rect x="20" y="1" width="2.5" height="8" rx="1.25" fill="#7C3AED" opacity="0.7" />
      {/* Calendar body */}
      <rect x="1" y="6" width="30" height="25" rx="4" fill="#1C1917" stroke="#5B21B6" strokeWidth="1" />
      {/* Header */}
      <rect x="1" y="6" width="30" height="9" rx="4" fill="#5B21B6" />
      <rect x="1" y="11" width="30" height="4" fill="#5B21B6" />
      {/* Day dots */}
      <circle cx="9" cy="21" r="1.2" fill="#78716C" opacity="0.4" />
      <circle cx="16" cy="21" r="1.2" fill="#78716C" opacity="0.4" />
      <circle cx="23" cy="21" r="1.2" fill="#78716C" opacity="0.4" />
      {/* Highlighted day */}
      <rect x="14" y="24" width="5" height="5" rx="1.5" fill="#5B21B6" opacity="0.9" />
    </svg>
  )
}
