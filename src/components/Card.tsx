import React from 'react'

type Props = {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export function Card({ children, className = '', hover = true }: Props) {
  return (
    <div
      className={`bg-surface border border-border rounded-sm p-6 ${hover ? 'hover:shadow-md transition-shadow duration-200' : ''} ${className}`}
    >
      {children}
    </div>
  )
}
