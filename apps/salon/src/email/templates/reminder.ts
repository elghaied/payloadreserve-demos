type ReminderEmailData = {
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
    subject: 'Appointment Reminder - Tomorrow',
    greeting: (name: string) => `Dear ${name},`,
    intro: 'This is a friendly reminder about your upcoming appointment.',
    detailsHeading: 'Your Appointment',
    service: 'Service',
    specialist: 'Specialist',
    date: 'Date',
    time: 'Time',
    duration: 'Duration',
    minutes: 'minutes',
    tips: 'A Few Reminders',
    tip1: 'Please arrive 5 minutes before your scheduled time.',
    tip2: 'If you need to cancel, please let us know at least 24 hours in advance.',
    tip3: 'Feel free to share any specific preferences when you arrive.',
    closing: 'See you soon,',
    team: 'The Lumiere Salon Team',
  },
  fr: {
    subject: 'Rappel de rendez-vous - Demain',
    greeting: (name: string) => `Cher(e) ${name},`,
    intro: 'Nous vous rappelons votre prochain rendez-vous.',
    detailsHeading: 'Votre rendez-vous',
    service: 'Service',
    specialist: 'Specialiste',
    date: 'Date',
    time: 'Heure',
    duration: 'Duree',
    minutes: 'minutes',
    tips: 'Quelques rappels',
    tip1: 'Veuillez arriver 5 minutes avant l\'heure prevue.',
    tip2: 'Si vous devez annuler, merci de nous prevenir au moins 24 heures a l\'avance.',
    tip3: 'N\'hesitez pas a nous faire part de vos preferences a votre arrivee.',
    closing: 'A bientot,',
    team: 'L\'equipe Lumiere Salon',
  },
}

export function reminderEmail(data: ReminderEmailData): {
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
              <!-- Gold accent bar -->
              <div style="height: 3px; background-color: #C4A35A;"></div>

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
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #EEECE7; border-radius: 2px;">
                      <tr>
                        <td style="padding: 20px 24px 12px 24px; border-bottom: 1px solid #EEECE7;">
                          <span style="font-size: 12px; font-weight: 600; letter-spacing: 2px; color: #C4A35A; text-transform: uppercase;">${t.detailsHeading}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 16px 24px;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="padding: 6px 0; font-size: 14px; color: #888888; width: 120px;">${t.service}</td>
                              <td style="padding: 6px 0; font-size: 14px; color: #1A1A1A; font-weight: 600;">${serviceName}</td>
                            </tr>
                            <tr>
                              <td style="padding: 6px 0; font-size: 14px; color: #888888; width: 120px;">${t.specialist}</td>
                              <td style="padding: 6px 0; font-size: 14px; color: #1A1A1A; font-weight: 600;">${specialistName}</td>
                            </tr>
                            <tr>
                              <td style="padding: 6px 0; font-size: 14px; color: #888888; width: 120px;">${t.date}</td>
                              <td style="padding: 6px 0; font-size: 14px; color: #1A1A1A; font-weight: 600;">${date}</td>
                            </tr>
                            <tr>
                              <td style="padding: 6px 0; font-size: 14px; color: #888888; width: 120px;">${t.time}</td>
                              <td style="padding: 6px 0; font-size: 14px; color: #1A1A1A; font-weight: 600;">${time}</td>
                            </tr>
                            <tr>
                              <td style="padding: 6px 0; font-size: 14px; color: #888888; width: 120px;">${t.duration}</td>
                              <td style="padding: 6px 0; font-size: 14px; color: #1A1A1A; font-weight: 600;">${duration} ${t.minutes}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Tips -->
                <tr>
                  <td style="padding: 0 40px 32px 40px;">
                    <p style="margin: 0 0 12px 0; font-size: 12px; font-weight: 600; letter-spacing: 2px; color: #C4A35A; text-transform: uppercase;">${t.tips}</p>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 6px 0; font-size: 14px; line-height: 1.5; color: #888888;">
                          <span style="color: #C4A35A; margin-right: 8px;">&bull;</span> ${t.tip1}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 14px; line-height: 1.5; color: #888888;">
                          <span style="color: #C4A35A; margin-right: 8px;">&bull;</span> ${t.tip2}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 14px; line-height: 1.5; color: #888888;">
                          <span style="color: #C4A35A; margin-right: 8px;">&bull;</span> ${t.tip3}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Closing -->
                <tr>
                  <td style="padding: 0 40px 40px 40px;">
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
