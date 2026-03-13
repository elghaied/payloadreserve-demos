import React from 'react'
import { inter, jetbrainsMono } from '@/lib/fonts'
import './globals.css'

export const metadata = {
  description: 'Éclat — Centre Culturel',
  title: 'Éclat — Centre Culturel',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-white text-black antialiased">
        {children}
      </body>
    </html>
  )
}
