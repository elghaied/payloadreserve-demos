export const specialistsData = [
  {
    name: 'Amélie Dubois',
    description: {
      en: 'Senior Esthetician — Facials, Lash & Brow',
      fr: 'Esthéticienne Senior — Soins du Visage, Cils & Sourcils',
    },
    serviceCategories: ['Facials', 'Lash & Brow'],
    imageKey: 'specialist1' as const,
    schedule: {
      name: 'Amélie — Weekly Schedule',
      days: ['mon', 'tue', 'wed', 'thu', 'fri'] as const,
      startTime: '09:00',
      endTime: '17:00',
    },
  },
  {
    name: 'Claire Fontaine',
    description: {
      en: 'Waxing Specialist — Waxing, Brow Shaping',
      fr: 'Spécialiste en Épilation — Épilation, Mise en Forme des Sourcils',
    },
    serviceCategories: ['Waxing', 'Lash & Brow'],
    imageKey: 'specialist2' as const,
    schedule: {
      name: 'Claire — Weekly Schedule',
      days: ['mon', 'tue', 'thu', 'fri', 'sat'] as const,
      startTime: '10:00',
      endTime: '18:00',
      exceptions: [{ day: 'wed', reason: 'Day off' }],
    },
  },
  {
    name: 'Nadia Khalil',
    description: {
      en: 'Massage Therapist — Massage, Classic Facial',
      fr: 'Massothérapeute — Massage, Soin du Visage Classique',
    },
    serviceCategories: ['Massage', 'Facials'],
    imageKey: 'specialist3' as const,
    schedule: {
      name: 'Nadia — Weekly Schedule',
      days: ['tue', 'wed', 'thu', 'fri'] as const,
      startTime: '09:00',
      endTime: '17:00',
      saturdayHours: { startTime: '09:00', endTime: '14:00' },
    },
  },
  {
    name: 'Isabelle Morel',
    description: {
      en: 'Nail Artist — Nails, Brow Shaping',
      fr: 'Prothésiste Ongulaire — Ongles, Mise en Forme des Sourcils',
    },
    serviceCategories: ['Nails', 'Lash & Brow'],
    imageKey: 'specialist4' as const,
    schedule: {
      name: 'Isabelle — Weekly Schedule',
      days: ['mon', 'tue', 'wed', 'thu', 'fri'] as const,
      startTime: '10:00',
      endTime: '19:00',
    },
  },
]
