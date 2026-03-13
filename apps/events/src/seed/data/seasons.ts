export const seasonsData = [
  {
    name: { en: 'Spring 2026', fr: 'Printemps 2026' },
    description: {
      en: 'A season of renewal featuring new commissions, emerging artists, and the return of our beloved outdoor concert series on La Terrasse.',
      fr: 'Une saison de renouveau avec de nouvelles commandes, des artistes emergents et le retour de notre serie de concerts en plein air sur La Terrasse.',
    },
    startDate: '2026-03-20',
    endDate: '2026-06-20',
    imageKey: 'seasonSpring' as const,
    active: true,
  },
  {
    name: { en: 'Summer 2026', fr: 'Été 2026' },
    description: {
      en: 'Long evenings of outdoor cinema, jazz under the stars, and our annual festival celebrating the intersection of art and technology.',
      fr: 'Longues soirees de cinema en plein air, jazz sous les etoiles et notre festival annuel celebrant l\'intersection de l\'art et de la technologie.',
    },
    startDate: '2026-06-21',
    endDate: '2026-09-22',
    imageKey: 'seasonSummer' as const,
    active: false,
  },
  {
    name: { en: 'Autumn 2026', fr: 'Automne 2026' },
    description: {
      en: 'Our richest season: Nuit Blanche, international dance companies, a major retrospective, and the documentary film festival.',
      fr: 'Notre saison la plus riche : Nuit Blanche, compagnies de danse internationales, une grande retrospective et le festival du film documentaire.',
    },
    startDate: '2026-09-23',
    endDate: '2026-12-20',
    active: false,
  },
  {
    name: { en: 'Winter 2026-27', fr: 'Hiver 2026-27' },
    description: {
      en: 'Intimate chamber concerts, holiday performances, and workshop series to warm the coldest months with creativity.',
      fr: 'Concerts de musique de chambre intimes, spectacles des fetes et series d\'ateliers pour rechauffer les mois les plus froids avec de la creativite.',
    },
    startDate: '2026-12-21',
    endDate: '2027-03-19',
    active: false,
  },
]
