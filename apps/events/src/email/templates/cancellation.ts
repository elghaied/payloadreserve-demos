type CancellationEmailData = {
  customerName: string
  eventName: string
  venueName: string
  date: string
  time: string
  locale?: string
}

const translations = {
  en: {
    subject: 'Your Booking Has Been Cancelled',
    greeting: (name: string) => `Dear ${name},`,
    cancelled: 'Your booking at Éclat Centre Culturel has been cancelled.',
    details: 'Cancelled Booking',
    event: 'Event',
    venue: 'Venue',
    date: 'Date',
    time: 'Time',
    rebook: 'We hope to welcome you another time. You can make a new booking at any time.',
    team: 'The Éclat Team',
  },
  fr: {
    subject: 'Votre reservation a ete annulee',
    greeting: (name: string) => `Cher(e) ${name},`,
    cancelled: 'Votre reservation a Éclat Centre Culturel a ete annulee.',
    details: 'Reservation annulee',
    event: 'Événement',
    venue: 'Salle',
    date: 'Date',
    time: 'Heure',
    rebook: 'Nous esperons vous accueillir une prochaine fois. Vous pouvez effectuer une nouvelle reservation a tout moment.',
    team: 'L\'equipe Éclat',
  },
}

export function cancellationEmail(data: CancellationEmailData) {
  const t = translations[data.locale === 'fr' ? 'fr' : 'en']

  return {
    subject: t.subject,
    html: `
      <div style="max-width:600px;margin:0 auto;font-family:Georgia,serif;background:#FAFAF8;padding:32px">
        <div style="background:#D4D0C8;height:4px;border-radius:2px;margin-bottom:24px"></div>
        <h1 style="color:#2D3561;font-size:24px;margin-bottom:8px">Éclat</h1>
        <p>${t.greeting(data.customerName)}</p>
        <p>${t.cancelled}</p>
        <table style="width:100%;border-collapse:collapse;margin:24px 0;background:white;border-radius:8px;overflow:hidden">
          <tr style="background:#999;color:white"><td colspan="2" style="padding:12px 16px;font-weight:600">${t.details}</td></tr>
          <tr><td style="padding:8px 16px;color:#666">${t.event}</td><td style="padding:8px 16px;text-decoration:line-through;color:#999">${data.eventName}</td></tr>
          <tr><td style="padding:8px 16px;color:#666">${t.venue}</td><td style="padding:8px 16px;text-decoration:line-through;color:#999">${data.venueName}</td></tr>
          <tr><td style="padding:8px 16px;color:#666">${t.date}</td><td style="padding:8px 16px;text-decoration:line-through;color:#999">${data.date}</td></tr>
          <tr><td style="padding:8px 16px;color:#666">${t.time}</td><td style="padding:8px 16px;text-decoration:line-through;color:#999">${data.time}</td></tr>
        </table>
        <p>${t.rebook}</p>
        <p style="color:#2D3561;font-weight:600">${t.team}</p>
      </div>
    `,
  }
}
