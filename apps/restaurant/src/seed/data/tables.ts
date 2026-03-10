export const tablesData = [
  {
    name: { en: 'Intimate Table', fr: 'Table Intime' },
    description: {
      en: 'A cozy table for two, perfect for romantic dinners or quiet conversations.',
      fr: 'Une table intime pour deux, parfaite pour les diners romantiques.',
    },
    imageKey: 'intimateTable' as const,
    seats: 2,
    quantity: 8,
    capacityMode: 'per-reservation' as const,
    supportedExperiences: [0, 1, 3], // Lunch, Dinner, Tasting Menu
    schedule: {
      type: 'recurring' as const,
      days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const,
      slots: [
        { startTime: '11:30', endTime: '14:30' },
        { startTime: '18:00', endTime: '22:30' },
      ],
    },
  },
  {
    name: { en: 'Classic Table', fr: 'Table Classique' },
    description: {
      en: 'A comfortable table for four in the heart of our dining room.',
      fr: 'Une table confortable pour quatre au coeur de notre salle.',
    },
    imageKey: 'classicTable' as const,
    seats: 4,
    quantity: 6,
    capacityMode: 'per-reservation' as const,
    supportedExperiences: [0, 1, 2], // Lunch, Dinner, Brunch
    schedule: {
      type: 'recurring' as const,
      days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const,
      slots: [
        { startTime: '11:30', endTime: '14:30' },
        { startTime: '18:00', endTime: '22:30' },
      ],
    },
  },
  {
    name: { en: 'Family Table', fr: 'Table Familiale' },
    description: {
      en: 'A spacious table for six, ideal for family gatherings and celebrations.',
      fr: 'Une table spacieuse pour six, ideale pour les reunions de famille et celebrations.',
    },
    imageKey: 'familyTable' as const,
    seats: 6,
    quantity: 3,
    capacityMode: 'per-reservation' as const,
    supportedExperiences: [0, 1, 2], // Lunch, Dinner, Brunch
    schedule: {
      type: 'recurring' as const,
      days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const,
      slots: [
        { startTime: '11:30', endTime: '14:30' },
        { startTime: '18:00', endTime: '22:30' },
      ],
    },
  },
  {
    name: { en: 'Private Salon', fr: 'Salon Prive' },
    description: {
      en: 'An elegant private dining room for up to 10 guests, perfect for special occasions.',
      fr: 'Un elegant salon prive pour jusqu\'a 10 convives, parfait pour les occasions speciales.',
    },
    imageKey: 'privateRoom' as const,
    seats: 10,
    quantity: 1,
    capacityMode: 'per-reservation' as const,
    supportedExperiences: [0, 1, 3, 4], // Lunch, Dinner, Tasting, Private
    schedule: {
      type: 'recurring' as const,
      days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const,
      slots: [
        { startTime: '11:30', endTime: '14:30' },
        { startTime: '18:00', endTime: '22:30' },
      ],
    },
  },
  {
    name: { en: 'Terrace Table', fr: 'Table Terrasse' },
    description: {
      en: 'A charming table on our garden terrace, surrounded by greenery and flowers.',
      fr: 'Une charmante table sur notre terrasse-jardin, entouree de verdure et de fleurs.',
    },
    imageKey: 'terrace' as const,
    seats: 4,
    quantity: 8,
    capacityMode: 'per-reservation' as const,
    supportedExperiences: [0, 1, 2], // Lunch, Dinner, Brunch
    schedule: {
      type: 'recurring' as const,
      days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const,
      slots: [
        { startTime: '11:30', endTime: '14:30' },
        { startTime: '18:00', endTime: '22:30' },
      ],
    },
  },
]
