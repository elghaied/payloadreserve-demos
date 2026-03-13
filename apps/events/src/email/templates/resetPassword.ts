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
    message: 'You requested a password reset for your Éclat Centre Culturel account.',
    action: 'Click the button below to set a new password:',
    button: 'Reset Password',
    expiry: 'This link will expire in 1 hour.',
    ignore: "If you didn't request this, you can safely ignore this email.",
    team: 'The Éclat Team',
  },
  fr: {
    subject: 'Réinitialisez votre mot de passe',
    greeting: (name: string) => (name ? `Cher(e) ${name},` : 'Bonjour,'),
    message:
      'Vous avez demandé une réinitialisation de mot de passe pour votre compte Éclat Centre Culturel.',
    action: 'Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe :',
    button: 'Réinitialiser le mot de passe',
    expiry: 'Ce lien expirera dans 1 heure.',
    ignore: "Si vous n'avez pas fait cette demande, vous pouvez ignorer ce courriel.",
    team: "L'équipe Éclat",
  },
}

export function resetPasswordSubject(locale?: string): string {
  const t = translations[locale === 'fr' ? 'fr' : 'en']
  return t.subject
}

export function resetPasswordEmail(data: ResetPasswordEmailData) {
  const t = translations[data.locale === 'fr' ? 'fr' : 'en']
  const resetURL = `${data.serverURL}/${data.locale || 'en'}/reset-password?token=${data.token}`

  return {
    subject: t.subject,
    html: `
      <div style="max-width:600px;margin:0 auto;font-family:Georgia,serif;background:#FAFAF8;padding:32px">
        <div style="background:#2D3561;height:4px;border-radius:2px;margin-bottom:24px"></div>
        <h1 style="color:#2D3561;font-size:24px;margin-bottom:8px">Éclat</h1>
        <p>${t.greeting(data.customerName)}</p>
        <p>${t.message}</p>
        <p>${t.action}</p>
        <div style="text-align:center;margin:32px 0">
          <a href="${resetURL}" style="display:inline-block;background:#2D3561;color:white;padding:14px 32px;text-decoration:none;font-weight:600;border-radius:4px">${t.button}</a>
        </div>
        <p style="color:#888;font-size:14px">${t.expiry}</p>
        <p style="color:#888;font-size:14px">${t.ignore}</p>
        <p style="color:#2D3561;font-weight:600">${t.team}</p>
      </div>
    `,
  }
}
