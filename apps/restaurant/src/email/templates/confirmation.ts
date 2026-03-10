type ConfirmationEmailData = {
  customerName: string
  experienceName: string
  tableName: string
  date: string
  time: string
  partySize?: number
  locale?: string
}

const translations = {
  en: {
    subject: 'Your Reservation is Confirmed',
    greeting: (name: string) => `Dear ${name},`,
    confirmed: 'Your reservation at Le Jardin Dore has been confirmed.',
    details: 'Reservation Details',
    experience: 'Dining Experience',
    table: 'Table',
    date: 'Date',
    time: 'Time',
    partySize: 'Party Size',
    guests: 'guests',
    reminder: 'Please arrive 10 minutes before your reservation time.',
    closing: 'We look forward to welcoming you.',
    team: 'The Le Jardin Dore Team',
  },
  fr: {
    subject: 'Votre reservation est confirmee',
    greeting: (name: string) => `Cher(e) ${name},`,
    confirmed: 'Votre reservation au Jardin Dore a ete confirmee.',
    details: 'Details de la reservation',
    experience: 'Experience culinaire',
    table: 'Table',
    date: 'Date',
    time: 'Heure',
    partySize: 'Nombre de convives',
    guests: 'convives',
    reminder: 'Veuillez arriver 10 minutes avant l\'heure de votre reservation.',
    closing: 'Nous avons hate de vous accueillir.',
    team: 'L\'equipe du Jardin Dore',
  },
}

export function confirmationEmail(data: ConfirmationEmailData) {
  const t = translations[data.locale === 'fr' ? 'fr' : 'en']
  const partySizeRow = data.partySize
    ? `<tr><td style="padding:8px 16px;color:#666">${t.partySize}</td><td style="padding:8px 16px;font-weight:600">${data.partySize} ${t.guests}</td></tr>`
    : ''

  return {
    subject: t.subject,
    html: `
      <div style="max-width:600px;margin:0 auto;font-family:Georgia,serif;background:#FAFAF8;padding:32px">
        <div style="background:#722F37;height:4px;border-radius:2px;margin-bottom:24px"></div>
        <h1 style="color:#722F37;font-size:24px;margin-bottom:8px">Le Jardin Dore</h1>
        <p>${t.greeting(data.customerName)}</p>
        <p>${t.confirmed}</p>
        <table style="width:100%;border-collapse:collapse;margin:24px 0;background:white;border-radius:8px;overflow:hidden">
          <tr style="background:#722F37;color:white"><td colspan="2" style="padding:12px 16px;font-weight:600">${t.details}</td></tr>
          <tr><td style="padding:8px 16px;color:#666">${t.experience}</td><td style="padding:8px 16px;font-weight:600">${data.experienceName}</td></tr>
          <tr><td style="padding:8px 16px;color:#666">${t.table}</td><td style="padding:8px 16px;font-weight:600">${data.tableName}</td></tr>
          <tr><td style="padding:8px 16px;color:#666">${t.date}</td><td style="padding:8px 16px;font-weight:600">${data.date}</td></tr>
          <tr><td style="padding:8px 16px;color:#666">${t.time}</td><td style="padding:8px 16px;font-weight:600">${data.time}</td></tr>
          ${partySizeRow}
        </table>
        <p style="color:#888;font-size:14px">${t.reminder}</p>
        <p>${t.closing}</p>
        <p style="color:#722F37;font-weight:600">${t.team}</p>
      </div>
    `,
  }
}
