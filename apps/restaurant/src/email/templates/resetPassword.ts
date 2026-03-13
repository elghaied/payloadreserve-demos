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
    message: 'You requested a password reset for your Le Jardin Dore account.',
    action: 'Click the button below to set a new password:',
    button: 'Reset Password',
    expiry: 'This link will expire in 1 hour.',
    ignore: "If you didn't request this, you can safely ignore this email.",
    team: 'The Le Jardin Dore Team',
  },
  fr: {
    subject: 'Reinitialisez votre mot de passe',
    greeting: (name: string) => (name ? `Cher(e) ${name},` : 'Bonjour,'),
    message:
      'Vous avez demande une reinitialisation de mot de passe pour votre compte Le Jardin Dore.',
    action: 'Cliquez sur le bouton ci-dessous pour definir un nouveau mot de passe :',
    button: 'Reinitialiser le mot de passe',
    expiry: 'Ce lien expirera dans 1 heure.',
    ignore: "Si vous n'avez pas fait cette demande, vous pouvez ignorer ce courriel.",
    team: "L'equipe du Jardin Dore",
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

  const html = `
    <div style="max-width:600px;margin:0 auto;font-family:Georgia,serif;background:#FAFAF8;padding:32px">
      <div style="background:#722F37;height:4px;border-radius:2px;margin-bottom:24px"></div>
      <h1 style="color:#722F37;font-size:24px;margin-bottom:8px">Le Jardin Dore</h1>
      <p>${t.greeting(customerName)}</p>
      <p>${t.message}</p>
      <p>${t.action}</p>
      <div style="text-align:center;margin:32px 0">
        <a href="${resetURL}" style="display:inline-block;background:#722F37;color:#FFFFFF;padding:14px 32px;text-decoration:none;font-weight:600;font-size:14px;letter-spacing:1px;border-radius:4px">${t.button}</a>
      </div>
      <hr style="border:none;border-top:1px solid #E2DDD4;margin:24px 0" />
      <p style="color:#888;font-size:14px">${t.expiry}</p>
      <p style="color:#888;font-size:14px">${t.ignore}</p>
      <p style="color:#722F37;font-weight:600">${t.team}</p>
    </div>`

  return { subject, html }
}
