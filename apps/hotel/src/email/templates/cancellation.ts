type CancellationEmailData = {
  customerName: string
  serviceName: string
  specialistName: string
  date: string
  time: string
  duration: number
  locale?: 'en' | 'fr'
}

export function cancellationEmail(data: CancellationEmailData): {
  subject: string
  html: string
} {
  const { customerName, serviceName, date, locale = 'en' } = data
  const isEn = locale === 'en'

  return {
    subject: isEn ? 'Reservation Cancelled' : 'Reservation annulee',
    html: `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;background:#FBF9F4;padding:40px;">
      <div style="max-width:600px;margin:0 auto;background:#fff;padding:40px;border-top:3px solid #B8860B;">
        <p>${isEn ? 'Dear' : 'Cher(e)'} ${customerName},</p>
        <p>${isEn ? `Your reservation for ${serviceName} on ${date} has been cancelled.` : `Votre reservation pour ${serviceName} le ${date} a ete annulee.`}</p>
        <p style="color:#B8860B;">${isEn ? 'The Grand Hotel Team' : "L'equipe du Grand Hotel"}</p>
      </div>
    </body></html>`,
  }
}
