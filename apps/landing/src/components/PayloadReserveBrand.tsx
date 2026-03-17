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
  forceDark?: boolean
}

export function PayloadReserveBrand({
  size = 'md',
  className,
  forceDark = false,
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
      <span>Payload<span className={forceDark ? 'text-violet-400' : 'text-violet-700 dark:text-violet-400'}>Reserve</span></span>
    </Link>
  )
}
