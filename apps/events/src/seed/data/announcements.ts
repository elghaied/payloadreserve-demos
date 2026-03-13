export const announcementsData = [
  {
    title: { en: 'Jazz au Jardin', fr: 'Jazz au Jardin' },
    description: {
      en: 'Every Friday evening from April to September, enjoy world-class jazz on La Terrasse with a glass of wine as the sun sets over the courtyard.',
      fr: 'Chaque vendredi soir d\'avril à septembre, profitez de jazz de classe mondiale sur La Terrasse avec un verre de vin au coucher du soleil.',
    },
    type: 'concert-series' as const,
    imageKey: 'announcementJazz' as const,
    startDate: '2026-04-03',
    endDate: '2026-09-25',
    ctaText: { en: 'View Schedule', fr: 'Voir le programme' },
    ctaLink: '/events',
    active: true,
    featured: true,
    eventTypeIndex: 0, // Concert
    venueIndex: 4, // La Terrasse
  },
  {
    title: { en: 'Nuit Blanche at Éclat', fr: 'Nuit Blanche à Éclat' },
    description: {
      en: 'Join us for an all-night celebration of art, music, and performance. Every space in Éclat transformed into a living artwork from dusk until dawn.',
      fr: 'Rejoignez-nous pour une célébration nocturne de l\'art, de la musique et du spectacle. Chaque espace d\'Éclat transformé en œuvre vivante du crépuscule à l\'aube.',
    },
    type: 'gala' as const,
    imageKey: 'announcementNuit' as const,
    startDate: '2026-10-03',
    ctaText: { en: 'Get Tickets', fr: 'Obtenir des billets' },
    ctaLink: '/book',
    active: true,
    featured: true,
    eventTypeIndex: 0, // Concert
    venueIndex: 0, // Grande Salle
  },
  {
    title: { en: 'Yuki Tanaka: Reflets', fr: 'Yuki Tanaka : Reflets' },
    description: {
      en: 'A major new light installation by Yuki Tanaka transforms Galerie Lumière into an immersive landscape of reflections and shadows.',
      fr: 'Une nouvelle installation lumineuse majeure de Yuki Tanaka transforme la Galerie Lumière en un paysage immersif de reflets et d\'ombres.',
    },
    type: 'exhibition-opening' as const,
    imageKey: 'announcementYuki' as const,
    startDate: '2026-05-01',
    endDate: '2026-07-15',
    ctaText: { en: 'Learn More', fr: 'En savoir plus' },
    ctaLink: '/events',
    active: true,
    featured: true,
    eventTypeIndex: 2, // Exhibition
    venueIndex: 2, // Galerie Lumière
  },
  {
    title: { en: 'Ciné en Plein Air', fr: 'Ciné en Plein Air' },
    description: {
      en: 'Our summer outdoor film series returns to La Terrasse. Classic and contemporary films under the Parisian sky every Saturday.',
      fr: 'Notre série de cinéma en plein air revient sur La Terrasse. Films classiques et contemporains sous le ciel parisien chaque samedi.',
    },
    type: 'special-screening' as const,
    imageKey: 'announcementCine' as const,
    startDate: '2026-07-04',
    endDate: '2026-08-29',
    ctaText: { en: 'See Films', fr: 'Voir les films' },
    ctaLink: '/events',
    active: true,
    featured: false,
    eventTypeIndex: 3, // Film Screening
    venueIndex: 4, // La Terrasse
  },
  {
    title: { en: 'Atelier Créatif: Danse', fr: 'Atelier Créatif : Danse' },
    description: {
      en: 'A 12-week contemporary dance workshop series led by Éloise Dupont. All levels welcome. Studio Éclat, every Wednesday.',
      fr: 'Une série de 12 ateliers de danse contemporaine animés par Éloise Dupont. Tous niveaux. Studio Éclat, chaque mercredi.',
    },
    type: 'workshop-series' as const,
    imageKey: 'announcementAtelier' as const,
    startDate: '2026-03-25',
    endDate: '2026-06-10',
    ctaText: { en: 'Register', fr: "S'inscrire" },
    ctaLink: '/book',
    active: true,
    featured: false,
    eventTypeIndex: 4, // Workshop
    venueIndex: 3, // Studio Éclat
  },
]
