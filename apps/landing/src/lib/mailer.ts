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

