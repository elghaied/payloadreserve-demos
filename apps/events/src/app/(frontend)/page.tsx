import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-4xl font-bold tracking-tight">
        {user ? `Welcome back, ${user.email}` : 'Events Demo'}
      </h1>
      <p className="text-muted-foreground">payload-reserve event booking & ticketing</p>
      <div className="flex gap-3">
        <a
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          href={payloadConfig.routes.admin}
        >
          Admin Panel
        </a>
      </div>
    </div>
  )
}
