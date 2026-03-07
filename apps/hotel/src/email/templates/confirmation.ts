type ConfirmationEmailData = {
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
    subject: 'Your Reservation is Confirmed',
    greeting: (name: string) => `Dear ${name},`,
    intro: 'Your hotel reservation has been confirmed. We look forward to welcoming you!',
    detailsHeading: 'Reservation Details',
    roomType: 'Room Type',
    checkIn: 'Check-in',
    checkOut: 'Check-out',
    reminder:
      'Check-in is available from 3:00 PM. If you need to cancel or modify, please do so at least 48 hours in advance.',
    closing: 'We look forward to your stay,',
    team: 'The Grand Hotel Team',
  },
  fr: {
    subject: 'Votre reservation est confirmee',
    greeting: (name: string) => `Cher(e) ${name},`,
    intro: 'Votre reservation d\'hotel a ete confirmee. Nous avons hate de vous accueillir !',
    detailsHeading: 'Details de la reservation',
    roomType: 'Type de chambre',
    checkIn: 'Arrivee',
    checkOut: 'Depart',
    reminder:
      'L\'enregistrement est disponible a partir de 15h00. Si vous devez annuler ou modifier, merci de le faire au moins 48 heures a l\'avance.',
    closing: 'Au plaisir de vous accueillir,',
    team: 'L\'equipe du Grand Hotel',
  },
}

export function confirmationEmail(data: ConfirmationEmailData): {
  subject: string
  html: string
} {
  const { customerName, serviceName, date, time, locale = 'en' } = data
  const t = translations[locale]

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
            <tr><td style="padding: 40px 40px 24px 40px;">
              <p style="margin: 0 0 8px 0; font-size: 16px;">${t.greeting(customerName)}</p>
              <p style="margin: 0; font-size: 16px; color: #555555;">${t.intro}</p>
            </td></tr>
            <tr><td style="padding: 0 40px 32px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #E2DDD4;">
                <tr><td style="padding: 20px 24px 12px 24px; border-bottom: 1px solid #E2DDD4;">
                  <span style="font-size: 12px; font-weight: 600; letter-spacing: 2px; color: #B8860B; text-transform: uppercase;">${t.detailsHeading}</span>
                </td></tr>
                <tr><td style="padding: 16px 24px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding: 6px 0; font-size: 14px; color: #888888; width: 120px;">${t.roomType}</td>
                      <td style="padding: 6px 0; font-size: 14px; font-weight: 600;">${serviceName}</td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0; font-size: 14px; color: #888888; width: 120px;">${t.checkIn}</td>
                      <td style="padding: 6px 0; font-size: 14px; font-weight: 600;">${date}</td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0; font-size: 14px; color: #888888; width: 120px;">${t.checkOut}</td>
                      <td style="padding: 6px 0; font-size: 14px; font-weight: 600;">${time}</td>
                    </tr>
                  </table>
                </td></tr>
              </table>
            </td></tr>
            <tr><td style="padding: 0 40px 40px 40px;">
              <p style="margin: 0 0 24px 0; font-size: 14px; color: #888888; border-left: 2px solid #B8860B; padding-left: 16px;">${t.reminder}</p>
              <p style="margin: 0; font-size: 16px; color: #555555;">${t.closing}<br /><span style="color: #B8860B;">${t.team}</span></p>
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
