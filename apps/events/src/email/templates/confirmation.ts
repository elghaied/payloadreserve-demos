type ConfirmationEmailData = {
  customerName: string
  eventName: string
  venueName: string
  date: string
  time: string
  ticketQuantity?: number
  locale?: string
}

const translations = {
  en: {
    subject: 'Your Booking is Confirmed',
    greeting: (name: string) => `Dear ${name},`,
    confirmed: 'Your booking at Éclat Centre Culturel has been confirmed.',
    details: 'Booking Details',
    event: 'Event',
    venue: 'Venue',
    date: 'Date',
    time: 'Time',
    tickets: 'Tickets',
    ticketUnit: 'tickets',
    reminder: 'Please arrive 15 minutes before the event starts.',
    closing: 'We look forward to welcoming you.',
    team: 'The Éclat Team',
  },
  fr: {
    subject: 'Votre reservation est confirmee',
    greeting: (name: string) => `Cher(e) ${name},`,
    confirmed: 'Votre reservation a Éclat Centre Culturel a ete confirmee.',
    details: 'Details de la reservation',
    event: 'Événement',
    venue: 'Salle',
    date: 'Date',
    time: 'Heure',
    tickets: 'Billets',
    ticketUnit: 'billets',
    reminder: 'Veuillez arriver 15 minutes avant le debut de l\'evenement.',
    closing: 'Nous avons hate de vous accueillir.',
    team: 'L\'equipe Éclat',
  },
}

export function confirmationEmail(data: ConfirmationEmailData) {
  const t = translations[data.locale === 'fr' ? 'fr' : 'en']
  const ticketRow = data.ticketQuantity
    ? `<tr><td style="padding:8px 16px;color:#666">${t.tickets}</td><td style="padding:8px 16px;font-weight:600">${data.ticketQuantity} ${t.ticketUnit}</td></tr>`
    : ''

  return {
    subject: t.subject,
    html: `
      <div style="max-width:600px;margin:0 auto;font-family:Georgia,serif;background:#FAFAF8;padding:32px">
        <div style="background:#2D3561;height:4px;border-radius:2px;margin-bottom:24px"></div>
        <h1 style="color:#2D3561;font-size:24px;margin-bottom:8px">Éclat</h1>
        <p>${t.greeting(data.customerName)}</p>
        <p>${t.confirmed}</p>
        <table style="width:100%;border-collapse:collapse;margin:24px 0;background:white;border-radius:8px;overflow:hidden">
          <tr style="background:#2D3561;color:white"><td colspan="2" style="padding:12px 16px;font-weight:600">${t.details}</td></tr>
          <tr><td style="padding:8px 16px;color:#666">${t.event}</td><td style="padding:8px 16px;font-weight:600">${data.eventName}</td></tr>
          <tr><td style="padding:8px 16px;color:#666">${t.venue}</td><td style="padding:8px 16px;font-weight:600">${data.venueName}</td></tr>
          <tr><td style="padding:8px 16px;color:#666">${t.date}</td><td style="padding:8px 16px;font-weight:600">${data.date}</td></tr>
          <tr><td style="padding:8px 16px;color:#666">${t.time}</td><td style="padding:8px 16px;font-weight:600">${data.time}</td></tr>
          ${ticketRow}
        </table>
        <p style="color:#888;font-size:14px">${t.reminder}</p>
        <p>${t.closing}</p>
        <p style="color:#2D3561;font-weight:600">${t.team}</p>
      </div>
    `,
  }
}
