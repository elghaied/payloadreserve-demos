type CancellationEmailData = {
  customerName: string
  serviceName: string
  specialistName: string
  date: string
  time: string
  duration: number
  locale?: 'en' | 'fr'
}

const translations = {
  en: {
    subject: 'Your Reservation Has Been Cancelled',
    greeting: (name: string) => `Dear ${name},`,
    intro: 'Your appointment has been cancelled. Here are the details of the cancelled reservation:',
    detailsHeading: 'Cancelled Appointment',
    service: 'Service',
    specialist: 'Specialist',
    date: 'Date',
    time: 'Time',
    duration: 'Duration',
    minutes: 'minutes',
    rebook:
      'If this was a mistake or you would like to rebook, please visit our website or contact us directly.',
    closing: 'Warm regards,',
    team: 'The Lumiere Salon Team',
  },
  fr: {
    subject: 'Votre reservation a ete annulee',
    greeting: (name: string) => `Cher(e) ${name},`,
    intro: 'Votre rendez-vous a ete annule. Voici les details de la reservation annulee :',
    detailsHeading: 'Rendez-vous annule',
    service: 'Service',
    specialist: 'Specialiste',
    date: 'Date',
    time: 'Heure',
    duration: 'Duree',
    minutes: 'minutes',
    rebook:
      'Si c\'est une erreur ou si vous souhaitez reprendre rendez-vous, veuillez visiter notre site web ou nous contacter directement.',
    closing: 'Cordialement,',
    team: 'L\'equipe Lumiere Salon',
  },
}

export function cancellationEmail(data: CancellationEmailData): {
  subject: string
  html: string
} {
  const { customerName, serviceName, specialistName, date, time, duration, locale = 'en' } = data
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
              <!-- Muted accent bar -->
              <div style="height: 3px; background-color: #D4D0C8;"></div>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 40px 40px 24px 40px;">
                    <p style="margin: 0 0 8px 0; font-size: 16px; line-height: 1.6; color: #1A1A1A;">
                      ${t.greeting(customerName)}
                    </p>
                    <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #555555;">
                      ${t.intro}
                    </p>
                  </td>
                </tr>

                <!-- Details -->
                <tr>
                  <td style="padding: 0 40px 32px 40px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #EEECE7; border-radius: 2px; opacity: 0.85;">
                      <tr>
                        <td style="padding: 20px 24px 12px 24px; border-bottom: 1px solid #EEECE7;">
                          <span style="font-size: 12px; font-weight: 600; letter-spacing: 2px; color: #999999; text-transform: uppercase;">${t.detailsHeading}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 16px 24px;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="padding: 6px 0; font-size: 14px; color: #888888; width: 120px;">${t.service}</td>
                              <td style="padding: 6px 0; font-size: 14px; color: #1A1A1A; text-decoration: line-through;">${serviceName}</td>
                            </tr>
                            <tr>
                              <td style="padding: 6px 0; font-size: 14px; color: #888888; width: 120px;">${t.specialist}</td>
                              <td style="padding: 6px 0; font-size: 14px; color: #1A1A1A; text-decoration: line-through;">${specialistName}</td>
                            </tr>
                            <tr>
                              <td style="padding: 6px 0; font-size: 14px; color: #888888; width: 120px;">${t.date}</td>
                              <td style="padding: 6px 0; font-size: 14px; color: #1A1A1A; text-decoration: line-through;">${date}</td>
                            </tr>
                            <tr>
                              <td style="padding: 6px 0; font-size: 14px; color: #888888; width: 120px;">${t.time}</td>
                              <td style="padding: 6px 0; font-size: 14px; color: #1A1A1A; text-decoration: line-through;">${time}</td>
                            </tr>
                            <tr>
                              <td style="padding: 6px 0; font-size: 14px; color: #888888; width: 120px;">${t.duration}</td>
                              <td style="padding: 6px 0; font-size: 14px; color: #1A1A1A; text-decoration: line-through;">${duration} ${t.minutes}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Rebook prompt -->
                <tr>
                  <td style="padding: 0 40px 40px 40px;">
                    <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #888888; border-left: 2px solid #D4D0C8; padding-left: 16px;">
                      ${t.rebook}
                    </p>
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
