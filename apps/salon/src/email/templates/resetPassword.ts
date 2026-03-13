type ResetPasswordEmailData = {
  customerName: string
  token: string
  locale?: string
  serverURL: string
}

const translations = {
  en: {
    subject: 'Reset Your Password',
    greeting: (name: string) => (name ? `Dear ${name},` : 'Hello,'),
    message: 'You requested a password reset for your Lumiere Salon account.',
    action: 'Click the button below to set a new password:',
    button: 'Reset Password',
    expiry: 'This link will expire in 1 hour.',
    ignore: "If you didn't request this, you can safely ignore this email.",
    team: 'The Lumiere Salon Team',
  },
  fr: {
    subject: 'Réinitialisez votre mot de passe',
    greeting: (name: string) => (name ? `Cher(e) ${name},` : 'Bonjour,'),
    message:
      'Vous avez demandé une réinitialisation de mot de passe pour votre compte Lumiere Salon.',
    action: 'Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe :',
    button: 'Réinitialiser le mot de passe',
    expiry: 'Ce lien expirera dans 1 heure.',
    ignore: "Si vous n'avez pas fait cette demande, vous pouvez ignorer ce courriel.",
    team: "L'équipe Lumiere Salon",
  },
}

export function resetPasswordSubject(locale?: string): string {
  const t = translations[locale === 'fr' ? 'fr' : 'en']
  return t.subject
}

export function resetPasswordEmail(data: ResetPasswordEmailData): {
  subject: string
  html: string
} {
  const { customerName, token, locale = 'en', serverURL } = data
  const t = translations[locale === 'fr' ? 'fr' : 'en']
  const resetURL = `${serverURL}/${locale}/reset-password?token=${token}`

  const subject = t.subject

  const html = `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAFAF8; font-family: Arial, Helvetica, sans-serif; color: #1A1A1A;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAFAF8;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">

          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom: 32px;">
              <span style="font-size: 28px; font-weight: 300; letter-spacing: 4px; color: #C4A35A; text-transform: uppercase;">Lumiere Salon</span>
            </td>
          </tr>

          <!-- Main Card -->
          <tr>
            <td style="background-color: #FFFFFF; border-radius: 2px; box-shadow: 0 1px 3px rgba(0,0,0,0.06);">
              <!-- Gold accent bar -->
              <div style="height: 3px; background-color: #C4A35A;"></div>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <!-- Greeting -->
                <tr>
                  <td style="padding: 40px 40px 16px 40px;">
                    <h1 style="margin: 0; font-size: 24px; font-weight: 300; color: #C4A35A; letter-spacing: 1px;">
                      ${t.greeting(customerName)}
                    </h1>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 0 40px 24px 40px;">
                    <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #555555;">
                      ${t.message}
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 0 40px 24px 40px;">
                    <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #555555;">
                      ${t.action}
                    </p>
                  </td>
                </tr>

                <!-- CTA Button -->
                <tr>
                  <td align="center" style="padding: 8px 40px 32px 40px;">
                    <a href="${resetURL}" style="display: inline-block; background-color: #C4A35A; color: #FFFFFF; padding: 14px 32px; text-decoration: none; font-weight: 600; font-size: 14px; letter-spacing: 1px; border-radius: 2px;">${t.button}</a>
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td style="padding: 0 40px;">
                    <div style="height: 1px; background-color: #EEECE7;"></div>
                  </td>
                </tr>

                <!-- Expiry & Ignore -->
                <tr>
                  <td style="padding: 24px 40px 12px 40px;">
                    <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #888888;">
                      ${t.expiry}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 40px 32px 40px;">
                    <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #888888;">
                      ${t.ignore}
                    </p>
                  </td>
                </tr>

                <!-- Closing -->
                <tr>
                  <td style="padding: 0 40px 40px 40px;">
                    <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #555555;">
                      <span style="color: #C4A35A;">${t.team}</span>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 32px 20px;">
              <span style="font-size: 12px; color: #BBBBBB;">Lumiere Salon</span>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  return { subject, html }
}
