export const venuesData = [
  {
    name: { en: 'Grande Salle', fr: 'Grande Salle' },
    description: {
      en: 'Our main performance hall with soaring ceilings and world-class acoustics. Seats 500 guests for concerts, theater, and dance performances.',
      fr: 'Notre salle principale avec de hauts plafonds et une acoustique de classe mondiale. 500 places pour concerts, theatre et spectacles de danse.',
    },
    imageKey: 'venueGrandeSalle' as const,
    seats: 500,
    quantity: 1,
    capacityMode: 'shared' as const,
    supportedEventTypes: [0, 1, 5], // Concert, Theater, Dance
    schedule: {
      days: ['tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const,
      slots: [{ startTime: '10:00', endTime: '23:00' }],
    },
  },
  {
    name: { en: 'Salon Noir', fr: 'Salon Noir' },
    description: {
      en: 'An intimate black-box theater seating 100. Versatile staging for experimental theater, film screenings, and workshops.',
      fr: 'Un theatre boite noire intime de 100 places. Mise en scene polyvalente pour theatre experimental, projections et ateliers.',
    },
    imageKey: 'venueSalonNoir' as const,
    seats: 100,
    quantity: 1,
    capacityMode: 'shared' as const,
    supportedEventTypes: [1, 3, 4], // Theater, Film, Workshop
    schedule: {
      days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const,
      slots: [{ startTime: '10:00', endTime: '22:00' }],
    },
  },
  {
    name: { en: 'Galerie Lumière', fr: 'Galerie Lumiere' },
    description: {
      en: 'A luminous gallery space with moveable walls and natural light. Perfect for exhibitions and intimate workshops. Capacity 80.',
      fr: 'Un espace galerie lumineux avec des cloisons mobiles et lumiere naturelle. Parfait pour les expositions et ateliers intimes. Capacite 80.',
    },
    imageKey: 'venueGalerie' as const,
    seats: 80,
    quantity: 1,
    capacityMode: 'shared' as const,
    supportedEventTypes: [2, 4], // Exhibition, Workshop
    schedule: {
      days: ['wed', 'thu', 'fri', 'sat', 'sun'] as const,
      slots: [{ startTime: '11:00', endTime: '20:00' }],
    },
  },
  {
    name: { en: 'Studio Éclat', fr: 'Studio Éclat' },
    description: {
      en: 'A modern, flexible studio space for workshops and film screenings. Equipped with projection and sound systems. Seats 50.',
      fr: 'Un espace studio moderne et flexible pour ateliers et projections. Equipe de systemes de projection et de son. 50 places.',
    },
    imageKey: 'venueStudio' as const,
    seats: 50,
    quantity: 1,
    capacityMode: 'shared' as const,
    supportedEventTypes: [3, 4], // Film, Workshop
    schedule: {
      days: ['mon', 'tue', 'wed', 'thu', 'fri'] as const,
      slots: [{ startTime: '09:00', endTime: '18:00' }],
    },
  },
  {
    name: { en: 'La Terrasse', fr: 'La Terrasse' },
    description: {
      en: 'A stunning outdoor terrace overlooking the courtyard garden. Hosts concerts, dance performances, and summer film screenings. Seats 200.',
      fr: 'Une superbe terrasse exterieure surplombant le jardin de la cour. Accueille concerts, spectacles de danse et projections estivales. 200 places.',
    },
    imageKey: 'venueTerrasse' as const,
    seats: 200,
    quantity: 1,
    capacityMode: 'shared' as const,
    supportedEventTypes: [0, 3, 5], // Concert, Film, Dance
    schedule: {
      days: ['thu', 'fri', 'sat', 'sun'] as const,
      slots: [{ startTime: '14:00', endTime: '23:00' }],
    },
  },
]
