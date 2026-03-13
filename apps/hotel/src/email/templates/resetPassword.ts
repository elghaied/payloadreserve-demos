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
    message: 'You requested a password reset for your Grand Hotel account.',
    action: 'Click the button below to set a new password:',
    button: 'Reset Password',
    expiry: 'This link will expire in 1 hour.',
    ignore: "If you didn't request this, you can safely ignore this email.",
    team: 'The Grand Hotel Team',
  },
  fr: {
    subject: 'Reinitialisez votre mot de passe',
    greeting: (name: string) => (name ? `Cher(e) ${name},` : 'Bonjour,'),
    message:
      'Vous avez demande une reinitialisation de mot de passe pour votre compte Grand Hotel.',
    action: 'Cliquez sur le bouton ci-dessous pour definir un nouveau mot de passe :',
    button: 'Reinitialiser le mot de passe',
    expiry: 'Ce lien expirera dans 1 heure.',
    ignore: "Si vous n'avez pas fait cette demande, vous pouvez ignorer ce courriel.",
    team: "L'equipe du Grand Hotel",
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
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>${subject}</title></head>
<body style="margin: 0; padding: 0; background-color: #FBF9F4; font-family: Arial, Helvetica, sans-serif; color: #0A1628;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #FBF9F4;">
    <tr><td align="center" style="padding: 40px 20px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">
        <tr><td align="center" style="padding-bottom: 32px;">
          <span style="font-size: 28px; font-weight: 300; letter-spacing: 4px; color: #B8860B; text-transform: uppercase;">Grand Hotel</span>
        </td></tr>
        <tr><td style="background-color: #FFFFFF; border-radius: 2px; box-shadow: 0 1px 3px rgba(0,0,0,0.06);">
          <div style="height: 3px; background-color: #B8860B;"></div>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="padding: 40px 40px 16px 40px;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 300; color: #B8860B; letter-spacing: 1px;">
                ${t.greeting(customerName)}
              </h1>
            </td></tr>
            <tr><td style="padding: 0 40px 24px 40px;">
              <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #555555;">${t.message}</p>
            </td></tr>
            <tr><td style="padding: 0 40px 24px 40px;">
              <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #555555;">${t.action}</p>
            </td></tr>
            <tr><td align="center" style="padding: 8px 40px 32px 40px;">
              <a href="${resetURL}" style="display: inline-block; background-color: #B8860B; color: #FFFFFF; padding: 14px 32px; text-decoration: none; font-weight: 600; font-size: 14px; letter-spacing: 1px; border-radius: 2px;">${t.button}</a>
            </td></tr>
            <tr><td style="padding: 0 40px;"><div style="height: 1px; background-color: #E2DDD4;"></div></td></tr>
            <tr><td style="padding: 24px 40px 12px 40px;">
              <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #888888;">${t.expiry}</p>
            </td></tr>
            <tr><td style="padding: 0 40px 32px 40px;">
              <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #888888;">${t.ignore}</p>
            </td></tr>
            <tr><td style="padding: 0 40px 40px 40px;">
              <p style="margin: 0; font-size: 16px; color: #555555;"><span style="color: #B8860B;">${t.team}</span></p>
            </td></tr>
          </table>
        </td></tr>
        <tr><td align="center" style="padding: 32px 20px;">
          <span style="font-size: 12px; color: #BBBBBB;">Grand Hotel</span>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

  return { subject, html }
}
