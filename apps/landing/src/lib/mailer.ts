import { render } from '@react-email/render'
import { DemoCredentials } from '@payload-reserve-demos/email-templates'
import type { DemoCredentialsData } from '@payload-reserve-demos/email-templates'
import type { InfrastructureSetting } from '@/payload-types'

export interface Mailer {
  sendDemoCredentials(to: string, data: DemoCredentialsData): Promise<void>
}

export function createMailer(settings: InfrastructureSetting): Mailer {
  return {
    async sendDemoCredentials(to: string, data: DemoCredentialsData): Promise<void> {
      if (!settings.resendApiKey) return

      const element = DemoCredentials(data)
      const html = await render(element)
      const fromName = settings.resendFromName || 'payload-reserve'
      const fromAddr = settings.resendFromAddress || ''

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${settings.resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `${fromName} <${fromAddr}>`,
          to: [to],
          subject: `Your ${data.demoType} demo is ready`,
          html,
        }),
      })

      if (!res.ok) {
        const body = await res.text()
        throw new Error(`Resend API error ${res.status}: ${body}`)
      }
    },
  }
}
