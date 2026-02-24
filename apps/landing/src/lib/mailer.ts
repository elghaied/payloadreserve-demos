import nodemailer from 'nodemailer'
import { render } from '@react-email/render'
import { DemoCredentials } from '@payload-reserve-demos/email-templates'
import type { DemoCredentialsData } from '@payload-reserve-demos/email-templates'

export interface Mailer {
  sendDemoCredentials(to: string, data: DemoCredentialsData): Promise<void>
}

function createTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST!,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
  })
}

class SmtpMailer implements Mailer {
  async sendDemoCredentials(to: string, data: DemoCredentialsData): Promise<void> {
    if (!process.env.SMTP_HOST) return

    const transport = createTransport()
    const element = DemoCredentials(data)
    const html = await render(element)

    await transport.sendMail({
      from: `"${process.env.SMTP_FROM_NAME ?? 'payload-reserve'}" <${process.env.SMTP_FROM!}>`,
      to,
      subject: `Your ${data.demoType} demo is ready`,
      html,
    })
  }
}

export const mailer: Mailer = new SmtpMailer()
