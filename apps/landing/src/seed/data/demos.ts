export type DemoKey = 'salon' | 'hotel' | 'restaurant' | 'events'

export interface DemoData {
  // Non-localized
  slug: DemoKey
  emoji: string
  active: boolean
  displayOrder: number
  liveUrl: string
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
  pluginSnippet: string
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
      pluginSnippet: `payloadReserve({
  slugs: {
    services: 'services',
    resources: 'specialists',
    schedules: 'schedules',
    reservations: 'reservations',
  },
  adminGroup: 'Salon',
  defaultBufferTime: 5,
  cancellationNoticePeriod: 24,
})`,
      screenshots: [{ alt: "Capture d'écran de la démo salon" }],
    },
  },

  // ── Hotel ───────────────────────────────────────────────────────────────────
  {
    slug: 'hotel',
    emoji: '🏨',
    active: false,
    displayOrder: 1,
    liveUrl: '',
    en: {
      name: 'Grand Hotel',
      tagline: 'Room reservations with multi-night stays',
      description:
        'Check-in/out date pickers, room type selection, capacity management, and guest communication all in Payload admin.',
      cardFeatures: [
        { text: 'Multi-night stays' },
        { text: 'Room types' },
        { text: 'Capacity limits' },
        { text: 'Guest management' },
      ],
      workflowIndustry: 'hotel',
      detailDescription:
        'A hotel reservation system powered by payload-reserve. Guests select check-in and check-out dates, choose room types, and receive booking confirmations - all managed from Payload admin.',
      detailFeatures: [
        {
          title: 'Multi-night stays',
          description:
            'Date-range booking with check-in and check-out. Conflict detection prevents double-booking.',
        },
        {
          title: 'Room types',
          description:
            'Define room categories (Standard, Deluxe, Suite) each with their own availability and pricing.',
        },
        {
          title: 'Capacity management',
          description:
            'Set per-room capacity and automatically prevent overbooking across your property.',
        },
        {
          title: 'Guest management',
          description:
            'Capture guest details, special requests, and preferences in Payload collections.',
        },
      ],
      pluginSnippet: `payloadReserve({
  slugs: {
    services: 'room-types',
    resources: 'rooms',
    schedules: 'schedules',
    reservations: 'reservations',
  },
  defaultBufferTime: 0,
  cancellationNoticePeriod: 48,
  adminGroup: 'Hotel',
})`,
      screenshots: [],
    },
    fr: {
      name: 'Grand Hôtel',
      tagline: 'Réservations de chambres avec séjours multi-nuits',
      description:
        "Sélecteurs de dates d'arrivée/départ, choix du type de chambre, gestion des capacités et communication avec les clients dans le panneau Payload.",
      cardFeatures: [
        { text: 'Séjours multi-nuits' },
        { text: 'Types de chambres' },
        { text: 'Limites de capacité' },
        { text: 'Gestion des clients' },
      ],
      workflowIndustry: 'hôtel',
      detailDescription:
        "Un système de réservation d'hôtel propulsé par payload-reserve. Les clients choisissent leurs dates d'arrivée et de départ, le type de chambre, puis reçoivent une confirmation - le tout géré dans l'admin Payload.",
      detailFeatures: [
        {
          title: 'Séjours multi-nuits',
          description:
            'Réservation par plage de dates avec arrivée et départ. La détection de conflit évite les doubles réservations.',
        },
        {
          title: 'Types de chambres',
          description:
            'Définissez des catégories (Standard, Deluxe, Suite) avec disponibilité et tarification propres.',
        },
        {
          title: 'Gestion des capacités',
          description: 'Définissez la capacité par chambre et évitez automatiquement le surbooking.',
        },
        {
          title: 'Gestion des clients',
          description:
            'Enregistrez les détails clients, demandes spéciales et préférences dans Payload.',
        },
      ],
      pluginSnippet: `payloadReserve({
  slugs: {
    services: 'room-types',
    resources: 'rooms',
    schedules: 'schedules',
    reservations: 'reservations',
  },
  defaultBufferTime: 0,
  cancellationNoticePeriod: 48,
  adminGroup: 'Hotel',
})`,
      screenshots: [],
    },
  },

  // ── Restaurant ──────────────────────────────────────────────────────────────
  {
    slug: 'restaurant',
    emoji: '🍽️',
    active: false,
    displayOrder: 2,
    liveUrl: '',
    en: {
      name: 'Maison Restaurant',
      tagline: 'Table booking with party size management',
      description:
        'Time-slotted dining reservations with configurable party sizes, special requests, and automatic table assignment.',
      cardFeatures: [
        { text: 'Time slot booking' },
        { text: 'Party size' },
        { text: 'Special requests' },
        { text: 'Auto assignment' },
      ],
      workflowIndustry: 'restaurant',
      detailDescription:
        'A restaurant reservation system built on payload-reserve. Guests pick a time slot, specify party size, and add special requests - automatically assigned to available tables.',
      detailFeatures: [
        {
          title: 'Time slot booking',
          description:
            'Define service windows (lunch, dinner) and slot intervals. Guests pick from available times.',
        },
        {
          title: 'Party size',
          description:
            'Guests specify their party size and the system matches them to an appropriately sized table.',
        },
        {
          title: 'Special requests',
          description:
            'Guests add dietary requirements, occasion notes, or seating preferences at booking.',
        },
        {
          title: 'Auto table assignment',
          description:
            'Tables are assigned automatically based on party size, availability, and capacity.',
        },
      ],
      pluginSnippet: `payloadReserve({
  slugs: {
    services: 'dining-options',
    resources: 'tables',
    schedules: 'schedules',
    reservations: 'reservations',
  },
  defaultBufferTime: 15,
  cancellationNoticePeriod: 2,
  adminGroup: 'Restaurant',
})`,
      screenshots: [],
    },
    fr: {
      name: 'Maison Restaurant',
      tagline: 'Réservation de table avec gestion de la taille du groupe',
      description:
        'Réservations à créneaux horaires avec tailles de groupes configurables, demandes spéciales et attribution automatique de table.',
      cardFeatures: [
        { text: 'Réservation par créneau' },
        { text: 'Taille du groupe' },
        { text: 'Demandes spéciales' },
        { text: 'Attribution auto' },
      ],
      workflowIndustry: 'restaurant',
      detailDescription:
        'Un système de réservation de restaurant basé sur payload-reserve. Les clients choisissent un créneau, indiquent la taille du groupe et ajoutent des demandes spéciales - puis sont assignés automatiquement à une table disponible.',
      detailFeatures: [
        {
          title: 'Réservation par créneau',
          description:
            'Définissez des services (déjeuner, dîner) et des intervalles ; les clients choisissent un horaire disponible.',
        },
        {
          title: 'Taille du groupe',
          description:
            'Les clients indiquent la taille du groupe et le système associe une table adaptée.',
        },
        {
          title: 'Demandes spéciales',
          description:
            "Les clients ajoutent régimes, notes d'occasion ou préférences de placement à la réservation.",
        },
        {
          title: 'Attribution automatique des tables',
          description:
            'Les tables sont attribuées automatiquement selon la taille du groupe, la disponibilité et la capacité.',
        },
      ],
      pluginSnippet: `payloadReserve({
  slugs: {
    services: 'dining-options',
    resources: 'tables',
    schedules: 'schedules',
    reservations: 'reservations',
  },
  defaultBufferTime: 15,
  cancellationNoticePeriod: 2,
  adminGroup: 'Restaurant',
})`,
      screenshots: [],
    },
  },

  // ── Events ──────────────────────────────────────────────────────────────────
  {
    slug: 'events',
    emoji: '🎪',
    active: false,
    displayOrder: 3,
    liveUrl: '',
    en: {
      name: 'Event Venue',
      tagline: 'Event scheduling with capacity management',
      description:
        'Full-day event bookings, capacity limits, multi-resource reservations, and ticketing — all from one plugin.',
      cardFeatures: [
        { text: 'Capacity limits' },
        { text: 'Multi-resource' },
        { text: 'Event types' },
        { text: 'Ticketing' },
      ],
      workflowIndustry: 'event',
      detailDescription:
        'A venue booking system powered by payload-reserve. Event organizers reserve spaces, select configurations, and manage capacity - with conflict detection across all spaces.',
      detailFeatures: [
        {
          title: 'Capacity limits',
          description:
            'Each space has a maximum capacity. The system prevents overbooking automatically.',
        },
        {
          title: 'Multi-resource booking',
          description:
            'Book multiple spaces or resources in a single reservation - great for complex events.',
        },
        {
          title: 'Event types',
          description:
            'Configure different event categories (conference, wedding, concert) with distinct rules.',
        },
        {
          title: 'Ticketing integration',
          description:
            'Hook into Stripe or your ticketing system to gate capacity with ticket sales.',
        },
      ],
      pluginSnippet: `payloadReserve({
  slugs: {
    services: 'event-types',
    resources: 'spaces',
    schedules: 'schedules',
    reservations: 'reservations',
  },
  defaultBufferTime: 30,
  cancellationNoticePeriod: 72,
  adminGroup: 'Events',
})`,
      screenshots: [],
    },
    fr: {
      name: 'Salle événementielle',
      tagline: "Planification d'événements avec gestion des capacités",
      description:
        "Réservations d'événements à la journée, limites de capacité, réservations multi-ressources et billetterie — tout depuis un seul plugin.",
      cardFeatures: [
        { text: 'Limites de capacité' },
        { text: 'Multi-ressources' },
        { text: "Types d'événements" },
        { text: 'Billetterie' },
      ],
      workflowIndustry: 'événementiel',
      detailDescription:
        'Un système de réservation de lieux propulsé par payload-reserve. Les organisateurs réservent des espaces, choisissent des configurations et gèrent la capacité - avec détection de conflit sur tous les espaces.',
      detailFeatures: [
        {
          title: 'Limites de capacité',
          description:
            'Chaque espace a une capacité maximale. Le système empêche automatiquement le surbooking.',
        },
        {
          title: 'Réservation multi-ressources',
          description:
            'Réservez plusieurs espaces ou ressources dans une seule réservation - idéal pour les événements complexes.',
        },
        {
          title: "Types d'événements",
          description:
            'Configurez des catégories (conférence, mariage, concert) avec des règles distinctes.',
        },
        {
          title: 'Intégration billetterie',
          description:
            'Connectez Stripe ou votre système de billetterie pour contrôler la capacité via les ventes.',
        },
      ],
      pluginSnippet: `payloadReserve({
  slugs: {
    services: 'event-types',
    resources: 'spaces',
    schedules: 'schedules',
    reservations: 'reservations',
  },
  defaultBufferTime: 30,
  cancellationNoticePeriod: 72,
  adminGroup: 'Events',
})`,
      screenshots: [],
    },
  },
]
