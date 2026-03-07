import nodemailer from 'nodemailer'
import { render } from '@react-email/render'
import { DemoCredentials } from '@payload-reserve-demos/email-templates'
import type { DemoCredentialsData } from '@payload-reserve-demos/email-templates'
import type { InfrastructureSetting } from '@/payload-types'

export interface Mailer {
  sendDemoCredentials(to: string, data: DemoCredentialsData): Promise<void>
}

function createTransport(settings: InfrastructureSetting) {
  const port = settings.smtpPort || 587
  return nodemailer.createTransport({
    host: settings.smtpHost!,
    port,
    secure: port === 465,
    requireTLS: port !== 465,
    auth: {
      user: settings.smtpUser || '',
      pass: settings.smtpPass || '',
    },
  })
}

export function createMailer(settings: InfrastructureSetting): Mailer {
  return {
    async sendDemoCredentials(to: string, data: DemoCredentialsData): Promise<void> {
      if (!settings.smtpHost) return

      const transport = createTransport(settings)
      const element = DemoCredentials(data)
      const html = await render(element)
      const fromName = settings.smtpFromName || 'payload-reserve'
      const fromAddr = settings.smtpFrom || ''

      await transport.sendMail({
        from: `"${fromName}" <${fromAddr}>`,
        to,
        subject: `Your ${data.demoType} demo is ready`,
        html,
      })
    },
  }
}

