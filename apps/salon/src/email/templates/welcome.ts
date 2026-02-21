type WelcomeEmailData = {
  customerName: string
  locale?: 'en' | 'fr'
}

const translations = {
  en: {
    subject: 'Welcome to Lumiere Salon',
    greeting: (name: string) => `Welcome, ${name}!`,
    intro:
      'Thank you for joining Lumiere Salon. We are delighted to have you as part of our community.',
    whatNext: 'What\'s Next',
    step1Title: 'Browse Our Services',
    step1Body: 'Explore our curated selection of hair, beauty, and wellness treatments.',
    step2Title: 'Choose Your Specialist',
    step2Body: 'Find the perfect stylist or therapist to suit your needs.',
    step3Title: 'Book Your Appointment',
    step3Body: 'Reserve your preferred date and time in just a few clicks.',
    closing: 'We look forward to welcoming you,',
    team: 'The Lumiere Salon Team',
  },
  fr: {
    subject: 'Bienvenue chez Lumiere Salon',
    greeting: (name: string) => `Bienvenue, ${name} !`,
    intro:
      'Merci d\'avoir rejoint Lumiere Salon. Nous sommes ravis de vous compter parmi notre communaute.',
    whatNext: 'Et maintenant',
    step1Title: 'Decouvrez nos services',
    step1Body: 'Explorez notre selection de soins capillaires, beaute et bien-etre.',
    step2Title: 'Choisissez votre specialiste',
    step2Body: 'Trouvez le styliste ou therapeute ideal pour vos besoins.',
    step3Title: 'Reservez votre rendez-vous',
    step3Body: 'Reservez votre creneau prefere en quelques clics.',
    closing: 'Au plaisir de vous accueillir,',
    team: 'L\'equipe Lumiere Salon',
  },
}

export function welcomeEmail(data: WelcomeEmailData): {
  subject: string
  html: string
} {
  const { customerName, locale = 'en' } = data
  const t = translations[locale]

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
                  <td style="padding: 0 40px 32px 40px;">
                    <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #555555;">
                      ${t.intro}
                    </p>
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td style="padding: 0 40px;">
                    <div style="height: 1px; background-color: #EEECE7;"></div>
                  </td>
                </tr>

                <!-- Steps heading -->
                <tr>
                  <td style="padding: 32px 40px 20px 40px;">
                    <span style="font-size: 12px; font-weight: 600; letter-spacing: 2px; color: #C4A35A; text-transform: uppercase;">${t.whatNext}</span>
                  </td>
                </tr>

                <!-- Step 1 -->
                <tr>
                  <td style="padding: 0 40px 20px 40px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width: 40px; vertical-align: top;">
                          <div style="width: 28px; height: 28px; border-radius: 50%; background-color: #FAFAF8; border: 1px solid #C4A35A; text-align: center; line-height: 28px; font-size: 13px; color: #C4A35A;">1</div>
                        </td>
                        <td style="vertical-align: top;">
                          <p style="margin: 0 0 4px 0; font-size: 15px; font-weight: 600; color: #1A1A1A;">${t.step1Title}</p>
                          <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #888888;">${t.step1Body}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Step 2 -->
                <tr>
                  <td style="padding: 0 40px 20px 40px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width: 40px; vertical-align: top;">
                          <div style="width: 28px; height: 28px; border-radius: 50%; background-color: #FAFAF8; border: 1px solid #C4A35A; text-align: center; line-height: 28px; font-size: 13px; color: #C4A35A;">2</div>
                        </td>
                        <td style="vertical-align: top;">
                          <p style="margin: 0 0 4px 0; font-size: 15px; font-weight: 600; color: #1A1A1A;">${t.step2Title}</p>
                          <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #888888;">${t.step2Body}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Step 3 -->
                <tr>
                  <td style="padding: 0 40px 40px 40px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width: 40px; vertical-align: top;">
                          <div style="width: 28px; height: 28px; border-radius: 50%; background-color: #FAFAF8; border: 1px solid #C4A35A; text-align: center; line-height: 28px; font-size: 13px; color: #C4A35A;">3</div>
                        </td>
                        <td style="vertical-align: top;">
                          <p style="margin: 0 0 4px 0; font-size: 15px; font-weight: 600; color: #1A1A1A;">${t.step3Title}</p>
                          <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #888888;">${t.step3Body}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td style="padding: 0 40px;">
                    <div style="height: 1px; background-color: #EEECE7;"></div>
                  </td>
                </tr>

                <!-- Closing -->
                <tr>
                  <td style="padding: 32px 40px 40px 40px;">
                    <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #555555;">
                      ${t.closing}<br />
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
