export type DemoKey = 'salon' | 'hotel' | 'restaurant' | 'events'

export interface DemoData {
  // Non-localized
  slug: DemoKey
  emoji: string
  active: boolean
  displayOrder: number
  liveUrl: string
  pluginSnippet: string
  // Localized
  en: DemoLocale
  fr: DemoLocale
}

export interface DemoLocale {
  name: string
  tagline: string
  description: string
  cardFeatures: { text: string }[]
  workflowIndustry: string
  detailDescription: string
  detailFeatures: { title: string; description: string }[]
  featuresHeading: string
  pluginConfigHeading: string
  detailCtaTitle: string
  detailCtaSubtitle: string
  screenshots: { alt: string }[]
}

export const demosData: DemoData[] = [
  // ── Salon ──────────────────────────────────────────────────────────────────
  {
    slug: 'salon',
    emoji: '✂️',
    active: true,
    displayOrder: 0,
    liveUrl: 'https://salon.payloadreserve.com',
    pluginSnippet: `payloadReserve({
  slugs: {
    services: 'services',
    resources: 'specialists',
    schedules: 'schedules',
    reservations: 'reservations',
  },
  extraReservationFields: [
    {
      name: 'paymentReminderSent',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
  ],
  adminGroup: 'Salon',
  defaultBufferTime: 5,
  cancellationNoticePeriod: 24,
  hooks: {
    afterBookingConfirm: [notifyAfterConfirm],
    afterBookingCancel: [notifyAfterCancel],
  },
})`,
    en: {
      name: 'Lumière Salon',
      tagline: 'Appointment scheduling for beauty professionals',
      description:
        'Per-stylist booking with service menus, buffer times between appointments, and optional Stripe deposit collection.',
      cardFeatures: [
        { text: 'Per-stylist scheduling' },
        { text: 'Service menus' },
        { text: 'Buffer times' },
        { text: 'Stripe deposits' },
      ],
      workflowIndustry: 'salon',
      detailDescription:
        'A complete salon booking system built with payload-reserve. Clients book specific stylists, choose from service menus, and pay a deposit - all without leaving your site.',
      detailFeatures: [
        {
          title: 'Per-specialist scheduling',
          description: 'Clients select a stylist then see their individual calendar and open slots.',
        },
        {
          title: 'Service menus with durations',
          description:
            'Define services (cut, colour, treatment) with exact durations; slot length adjusts automatically.',
        },
        {
          title: 'Buffer times',
          description:
            'Automatic 5-minute gap between appointments; no manual blocking needed.',
        },
        {
          title: 'Email confirmations',
          description:
            "Confirmation and cancellation emails sent automatically via the plugin's lifecycle hooks.",
        },
        {
          title: 'Stripe payment gate',
          description: 'Charge a deposit or card-on-file before confirming - reduces no-shows.',
        },
        {
          title: 'Cancellation policy',
          description:
            '24-hour minimum notice enforced server-side; late cancellations flagged for staff.',
        },
      ],
      featuresHeading: 'Built for salon workflows',
      pluginConfigHeading: 'Plugin config for Lumière Salon',
      detailCtaTitle: 'Ready to explore Lumière Salon?',
      detailCtaSubtitle: 'Try the live demo or request your own private environment.',
      screenshots: [{ alt: 'Salon demo screenshot' }],
    },
    fr: {
      name: 'Lumière Salon',
      tagline: 'Planification de rendez-vous pour professionnels de la beauté',
      description:
        "Réservation par styliste avec menus de services, temps tampon entre rendez-vous et collecte optionnelle d'acompte Stripe.",
      cardFeatures: [
        { text: 'Planning par styliste' },
        { text: 'Menus de services' },
        { text: 'Temps tampon' },
        { text: 'Acomptes Stripe' },
      ],
      workflowIndustry: 'salon',
      detailDescription:
        'Un système de réservation de salon complet avec payload-reserve. Les clients réservent un styliste, choisissent un service et paient un acompte - sans quitter votre site.',
      detailFeatures: [
        {
          title: 'Planification par spécialiste',
          description:
            'Les clients choisissent un styliste puis voient son agenda et ses créneaux disponibles.',
        },
        {
          title: 'Menus de services avec durée',
          description:
            "Définissez des services (coupe, couleur, soin) avec une durée exacte ; la longueur des créneaux s'adapte automatiquement.",
        },
        {
          title: 'Temps tampon',
          description: 'Espace automatique de 5 minutes entre les rendez-vous ; aucun blocage manuel.',
        },
        {
          title: 'Confirmations par e-mail',
          description:
            "Les e-mails de confirmation et d'annulation sont envoyés automatiquement via les hooks du plugin.",
        },
        {
          title: 'Paiement Stripe',
          description: 'Encaissez un acompte ou une carte avant confirmation - cela réduit les absences.',
        },
        {
          title: "Politique d'annulation",
          description:
            'Préavis minimum de 24h appliqué côté serveur ; annulations tardives signalées au staff.',
        },
      ],
      featuresHeading: 'Conçu pour les workflows salon',
      pluginConfigHeading: 'Config du plugin pour Lumière Salon',
      detailCtaTitle: 'Prêt à explorer Lumière Salon ?',
      detailCtaSubtitle: 'Essayez la démo en direct ou demandez votre propre environnement privé.',
      screenshots: [{ alt: "Capture d'écran de la démo salon" }],
    },
  },

  // ── Hotel ───────────────────────────────────────────────────────────────────
  {
    slug: 'hotel',
    emoji: '🏨',
    active: true,
    displayOrder: 1,
    liveUrl: 'https://hotel.payloadreserve.com',
    pluginSnippet: `payloadReserve({
  slugs: {
    services: 'room-types',
    resources: 'rooms',
    schedules: 'schedules',
    reservations: 'reservations',
  },
  extraReservationFields: [
    {
      name: 'paymentReminderSent',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
  ],
  adminGroup: 'Hotel',
  defaultBufferTime: 0,
  cancellationNoticePeriod: 48,
  hooks: {
    afterBookingConfirm: [notifyAfterConfirm],
    afterBookingCancel: [notifyAfterCancel],
  },
})`,
    en: {
      name: 'Grand Hotel',
      tagline: 'Full-day room booking with inventory management',
      description:
        'Full-day room reservations with quantity-based inventory pools, housekeeping buffers between guests, and email notifications via lifecycle hooks.',
      cardFeatures: [
        { text: 'Full-day bookings' },
        { text: 'Room inventory' },
        { text: 'Housekeeping buffers' },
        { text: 'Email notifications' },
      ],
      workflowIndustry: 'hotel',
      detailDescription:
        'A hotel reservation system powered by payload-reserve. Guests select check-in and check-out dates, choose from five room types, and receive booking confirmations — with quantity-based inventory preventing overbooking.',
      detailFeatures: [
        {
          title: 'Full-day bookings',
          description:
            'Uses durationType: \'full-day\' for room stays. Guests select check-in and check-out dates; each night occupies a full calendar day.',
        },
        {
          title: 'Quantity-based inventory',
          description:
            'Multiple identical rooms per type (e.g. 40 Classic, 25 Superior) with per-reservation capacity mode. Conflict detection tracks occupancy across the pool.',
        },
        {
          title: 'Housekeeping buffers',
          description:
            'bufferTimeAfter on each room resource ensures cleaning time between guests — 4 to 6 hours depending on room type.',
        },
        {
          title: 'Email notifications',
          description:
            'Confirmation and cancellation emails sent automatically via afterBookingConfirm and afterBookingCancel hooks.',
        },
      ],
      featuresHeading: 'Built for hotel workflows',
      pluginConfigHeading: 'Plugin config for Grand Hotel',
      detailCtaTitle: 'Ready to explore Grand Hotel?',
      detailCtaSubtitle: 'Try the live demo or request your own private environment.',
      screenshots: [],
    },
    fr: {
      name: 'Grand Hôtel',
      tagline: "Réservation de chambres à la journée avec gestion d'inventaire",
      description:
        "Réservations de chambres à la journée avec pools d'inventaire par quantité, temps de ménage entre les clients et notifications e-mail via les hooks du cycle de vie.",
      cardFeatures: [
        { text: 'Réservations à la journée' },
        { text: 'Inventaire de chambres' },
        { text: 'Temps de ménage' },
        { text: 'Notifications e-mail' },
      ],
      workflowIndustry: 'hôtel',
      detailDescription:
        "Un système de réservation d'hôtel propulsé par payload-reserve. Les clients choisissent leurs dates d'arrivée et de départ parmi cinq types de chambres et reçoivent une confirmation — avec un inventaire par quantité empêchant le surbooking.",
      detailFeatures: [
        {
          title: 'Réservations à la journée',
          description:
            "Utilise durationType: 'full-day' pour les séjours. Les clients sélectionnent les dates d'arrivée et de départ ; chaque nuit occupe un jour calendaire complet.",
        },
        {
          title: 'Inventaire par quantité',
          description:
            'Plusieurs chambres identiques par type (ex. 40 Classic, 25 Superior) avec mode de capacité par réservation. La détection de conflit suit l\'occupation sur l\'ensemble du pool.',
        },
        {
          title: 'Temps de ménage',
          description:
            'bufferTimeAfter sur chaque ressource chambre garantit le temps de nettoyage entre les clients — 4 à 6 heures selon le type de chambre.',
        },
        {
          title: 'Notifications e-mail',
          description:
            "Les e-mails de confirmation et d'annulation sont envoyés automatiquement via les hooks afterBookingConfirm et afterBookingCancel.",
        },
      ],
      featuresHeading: 'Conçu pour les workflows hôteliers',
      pluginConfigHeading: 'Config du plugin pour Grand Hôtel',
      detailCtaTitle: 'Prêt à explorer Grand Hôtel ?',
      detailCtaSubtitle: 'Essayez la démo en direct ou demandez votre propre environnement privé.',
      screenshots: [],
    },
  },

  // ── Restaurant ──────────────────────────────────────────────────────────────
  {
    slug: 'restaurant',
    emoji: '🍽️',
    active: true,
    displayOrder: 2,
    liveUrl: 'https://restaurant.payloadreserve.com',
    pluginSnippet: `payloadReserve({
  slugs: {
    services: 'dining-experiences',
    resources: 'tables',
    schedules: 'schedules',
    reservations: 'reservations',
  },
  extraReservationFields: [
    {
      name: 'partySize',
      type: 'number',
      min: 1,
      max: 20,
      defaultValue: 2,
      admin: { description: 'Number of guests in the party' },
    },
  ],
  adminGroup: 'Restaurant',
  defaultBufferTime: 15,
  cancellationNoticePeriod: 4,
  hooks: {
    afterBookingConfirm: [notifyAfterConfirm],
    afterBookingCancel: [notifyAfterCancel],
  },
})`,
    en: {
      name: 'Le Jardin Doré',
      tagline: 'Fine dining reservations with party size tracking',
      description:
        'Curated dining experiences with a custom partySize field, 15-minute table turnover buffers, and a 4-hour cancellation window for same-day flexibility.',
      cardFeatures: [
        { text: 'Dining experiences' },
        { text: 'Party size' },
        { text: 'Table buffers' },
        { text: '4h cancellation' },
      ],
      workflowIndustry: 'restaurant',
      detailDescription:
        'A fine dining reservation system built on payload-reserve. Guests choose from curated dining experiences, specify party size via a custom field, and book tables with automatic turnover buffers between seatings.',
      detailFeatures: [
        {
          title: 'Dining experiences',
          description:
            'Five curated experiences with fixed durations (90–180 min) — from casual bistro to chef\'s table tasting menus.',
        },
        {
          title: 'Party size tracking',
          description:
            'Custom partySize field added via extraReservationFields (1–20 guests). Captured at booking and visible in admin.',
        },
        {
          title: 'Table turnover buffers',
          description:
            '15-minute defaultBufferTime between seatings gives staff time to reset tables without manual blocking.',
        },
        {
          title: 'Short-notice friendly',
          description:
            '4-hour cancellationNoticePeriod allows same-day reservations and last-minute changes.',
        },
      ],
      featuresHeading: 'Built for restaurant workflows',
      pluginConfigHeading: 'Plugin config for Le Jardin Doré',
      detailCtaTitle: 'Ready to explore Le Jardin Doré?',
      detailCtaSubtitle: 'Try the live demo or request your own private environment.',
      screenshots: [],
    },
    fr: {
      name: 'Le Jardin Doré',
      tagline: 'Réservations gastronomiques avec suivi de la taille du groupe',
      description:
        "Expériences gastronomiques avec un champ partySize personnalisé, rotation des tables de 15 minutes et fenêtre d'annulation de 4 heures pour plus de flexibilité.",
      cardFeatures: [
        { text: 'Expériences gastronomiques' },
        { text: 'Taille du groupe' },
        { text: 'Rotation des tables' },
        { text: 'Annulation 4h' },
      ],
      workflowIndustry: 'restaurant',
      detailDescription:
        "Un système de réservation gastronomique basé sur payload-reserve. Les clients choisissent parmi des expériences culinaires, indiquent la taille du groupe via un champ personnalisé et réservent avec des temps de rotation automatiques entre les services.",
      detailFeatures: [
        {
          title: 'Expériences gastronomiques',
          description:
            "Cinq expériences avec durées fixes (90–180 min) — du bistrot décontracté au menu dégustation du chef.",
        },
        {
          title: 'Suivi de la taille du groupe',
          description:
            "Champ partySize personnalisé ajouté via extraReservationFields (1–20 convives). Saisi à la réservation et visible dans l'admin.",
        },
        {
          title: 'Rotation des tables',
          description:
            'defaultBufferTime de 15 minutes entre les services donne au personnel le temps de préparer les tables sans blocage manuel.',
        },
        {
          title: 'Réservation de dernière minute',
          description:
            "cancellationNoticePeriod de 4 heures permet les réservations du jour même et les changements de dernière minute.",
        },
      ],
      featuresHeading: 'Conçu pour les workflows gastronomiques',
      pluginConfigHeading: 'Config du plugin pour Le Jardin Doré',
      detailCtaTitle: 'Prêt à explorer Le Jardin Doré ?',
      detailCtaSubtitle: 'Essayez la démo en direct ou demandez votre propre environnement privé.',
      screenshots: [],
    },
  },

  // ── Events ──────────────────────────────────────────────────────────────────
  {
    slug: 'events',
    emoji: '🎪',
    active: true,
    displayOrder: 3,
    liveUrl: 'https://events.payloadreserve.com',
    pluginSnippet: `payloadReserve({
  slugs: {
    services: 'event-types',
    resources: 'venues',
    schedules: 'schedules',
    reservations: 'bookings',
  },
  extraReservationFields: [
    {
      name: 'ticketQuantity',
      type: 'number',
      min: 1,
      max: 10,
      defaultValue: 1,
      admin: { description: 'Number of tickets for this booking' },
    },
  ],
  adminGroup: 'Éclat',
  defaultBufferTime: 30,
  cancellationNoticePeriod: 48,
  hooks: {
    afterBookingConfirm: [notifyAfterConfirm],
    afterBookingCancel: [notifyAfterCancel],
  },
})`,
    en: {
      name: 'Éclat Festival',
      tagline: 'Event ticketing with venue capacity control',
      description:
        'Per-booking ticket quantities with venue seat tracking, 30-minute setup/cleanup buffers, and 48-hour cancellation policy — all managed from the admin panel.',
      cardFeatures: [
        { text: 'Venue capacity' },
        { text: 'Ticket quantities' },
        { text: 'Setup buffers' },
        { text: 'Event types' },
      ],
      workflowIndustry: 'event',
      detailDescription:
        'A festival ticketing system powered by payload-reserve. Visitors book tickets for concerts, theater, exhibitions, and workshops across five venues — with per-booking capacity tracking and setup buffers between events.',
      detailFeatures: [
        {
          title: 'Ticket quantities',
          description:
            'Custom ticketQuantity field via extraReservationFields (1–10 per booking). Each booking deducts from the venue\'s seat count.',
        },
        {
          title: 'Venue capacity',
          description:
            'Per-reservation capacity mode across five venues (50–500 seats). Conflict detection prevents overselling automatically.',
        },
        {
          title: 'Setup/cleanup buffers',
          description:
            '30-minute defaultBufferTime between events gives crews time for stage changes and venue reset.',
        },
        {
          title: 'Event types',
          description:
            'Six event categories (concert, theater, exhibition, film, workshop, dance) mapped to compatible venues.',
        },
      ],
      featuresHeading: 'Built for event workflows',
      pluginConfigHeading: 'Plugin config for Éclat Festival',
      detailCtaTitle: 'Ready to explore Éclat Festival?',
      detailCtaSubtitle: 'Try the live demo or request your own private environment.',
      screenshots: [],
    },
    fr: {
      name: 'Éclat Festival',
      tagline: 'Billetterie événementielle avec contrôle de capacité des salles',
      description:
        "Quantité de billets par réservation avec suivi des places, temps de montage/démontage de 30 minutes et politique d'annulation de 48 heures — le tout géré depuis le panneau admin.",
      cardFeatures: [
        { text: 'Capacité des salles' },
        { text: 'Quantité de billets' },
        { text: 'Temps de montage' },
        { text: "Types d'événements" },
      ],
      workflowIndustry: 'événementiel',
      detailDescription:
        'Un système de billetterie festival propulsé par payload-reserve. Les visiteurs réservent des billets pour concerts, théâtre, expositions et ateliers dans cinq salles — avec suivi de capacité par réservation et temps de montage entre les événements.',
      detailFeatures: [
        {
          title: 'Quantité de billets',
          description:
            "Champ ticketQuantity personnalisé via extraReservationFields (1–10 par réservation). Chaque réservation est déduite du nombre de places de la salle.",
        },
        {
          title: 'Capacité des salles',
          description:
            'Mode de capacité par réservation sur cinq salles (50–500 places). La détection de conflit empêche automatiquement la survente.',
        },
        {
          title: 'Temps de montage/démontage',
          description:
            'defaultBufferTime de 30 minutes entre les événements pour les changements de scène et la remise en état de la salle.',
        },
        {
          title: "Types d'événements",
          description:
            "Six catégories d'événements (concert, théâtre, exposition, film, atelier, danse) associées aux salles compatibles.",
        },
      ],
      featuresHeading: 'Conçu pour les workflows événementiels',
      pluginConfigHeading: 'Config du plugin pour Éclat Festival',
      detailCtaTitle: 'Prêt à explorer Éclat Festival ?',
      detailCtaSubtitle: 'Essayez la démo en direct ou demandez votre propre environnement privé.',
      screenshots: [],
    },
  },
]
