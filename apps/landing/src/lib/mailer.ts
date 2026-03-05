import nodemailer from 'nodemailer'
import { render } from '@react-email/render'
import { DemoCredentials } from '@payload-reserve-demos/email-templates'
import type { DemoCredentialsData } from '@payload-reserve-demos/email-templates'
import type { InfrastructureSetting } from '@/payload-types'

export interface Mailer {
  sendDemoCredentials(to: string, data: DemoCredentialsData): Promise<void>
}

function createTransport(settings: InfrastructureSetting) {
  return nodemailer.createTransport({
    host: settings.smtpHost || process.env.SMTP_HOST!,
    port: settings.smtpPort || Number(process.env.SMTP_PORT ?? 587),
    secure: false,
    auth: {
      user: settings.smtpUser || process.env.SMTP_USER!,
      pass: settings.smtpPass || process.env.SMTP_PASS!,
    },
  })
}

export function createMailer(settings: InfrastructureSetting): Mailer {
  return {
    async sendDemoCredentials(to: string, data: DemoCredentialsData): Promise<void> {
      const host = settings.smtpHost || process.env.SMTP_HOST
      if (!host) return

      const transport = createTransport(settings)
      const element = DemoCredentials(data)
      const html = await render(element)
      const fromName = settings.smtpFromName || process.env.SMTP_FROM_NAME || 'payload-reserve'
      const fromAddr = settings.smtpFrom || process.env.SMTP_FROM!

      await transport.sendMail({
        from: `"${fromName}" <${fromAddr}>`,
        to,
        subject: `Your ${data.demoType} demo is ready`,
        html,
      })
    },
  }
}

export const mailer: Mailer = {
  async sendDemoCredentials(to, data) {
    if (!process.env.SMTP_HOST) return
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST!,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!,
      },
    })
    const element = DemoCredentials(data)
    const html = await render(element)
    await transport.sendMail({
      from: `"${process.env.SMTP_FROM_NAME ?? 'payload-reserve'}" <${process.env.SMTP_FROM!}>`,
      to,
      subject: `Your ${data.demoType} demo is ready`,
      html,
    })
  },
}
