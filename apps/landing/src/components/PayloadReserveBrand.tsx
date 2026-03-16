'use client'

import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { cn } from '@/utilities/cn'

const sizeConfig = {
  sm: { logo: 20, text: 'text-sm' },
  md: { logo: 24, text: 'text-base' },
}

type PayloadReserveBrandProps = {
  size?: 'sm' | 'md'
  className?: string
}

export function PayloadReserveBrand({
  size = 'md',
  className,
}: PayloadReserveBrandProps) {
  const config = sizeConfig[size]

  return (
    <Link
      href="/"
      aria-label="PayloadReserve home"
      className={cn(
        'inline-flex items-center gap-2 font-body font-semibold tracking-tight select-none',
        config.text,
        className,
      )}
    >
      <Image
        src="/reserve-logo.svg"
        alt=""
        width={config.logo}
        height={config.logo}
      />
      Payload
      <span className="text-violet-700 dark:text-violet-400 -ml-1.5">
        Reserve
      </span>
    </Link>
  )
}
