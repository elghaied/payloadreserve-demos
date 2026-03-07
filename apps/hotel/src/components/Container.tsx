import React from 'react'
import { cn } from '@/lib/utils'

type Props = {
  children: React.ReactNode
  className?: string
  as?: 'div' | 'section' | 'article'
}

export function Container({ children, className, as: Tag = 'div' }: Props) {
  return <Tag className={cn('mx-auto max-w-7xl px-4 sm:px-6 lg:px-8', className)}>{children}</Tag>
}
