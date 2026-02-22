export const homepageData = {
  en: {
    hero: {
      title: 'Your Beauty, Our Passion',
      subtitle: 'Experience the art of esthetic care in a serene, luxurious setting in the heart of Montreal.',
      ctaText: 'Book Your Appointment',
      ctaLink: '/en/book',
    },
    about: {
      heading: 'Welcome to Lumière',
      bodyText: 'Founded in 2018, Lumière Salon is a haven of tranquility where beauty meets expertise. Our team of skilled estheticians brings years of experience and a genuine passion for helping you look and feel your best. We believe in the transformative power of self-care — every treatment is tailored to your unique needs.',
    },
    servicesShowcase: {
      heading: 'Our Services',
      subtitle: 'From rejuvenating facials to expert body treatments, discover our curated menu of esthetic services.',
    },
    specialistsSection: {
      heading: 'Meet Our Specialists',
      subtitle: 'Passionate experts dedicated to your beauty and well-being.',
    },
    testimonials: [
      { quote: 'Lumière transformed my skin! The deep cleansing facial was exactly what I needed. I leave every appointment feeling refreshed and confident.', author: 'Marie-Claire L.', rating: 5 },
      { quote: 'The best lash lift I\'ve ever had. Amélie is incredibly talented and the salon atmosphere is so calming. Highly recommend!', author: 'Jessica T.', rating: 5 },
      { quote: 'I\'ve been coming here for over a year and the quality is always consistent. The Swedish massage with Nadia is pure bliss.', author: 'Dominique B.', rating: 5 },
    ],
    cta: {
      heading: 'Ready to Treat Yourself?',
      body: 'Book your appointment today and experience the Lumière difference. Your journey to radiant beauty starts here.',
      buttonText: 'Book Now',
      buttonLink: '/en/book',
    },
  },
  fr: {
    hero: {
      title: 'Votre Beauté, Notre Passion',
      subtitle: 'Découvrez l\'art des soins esthétiques dans un cadre serein et luxueux au cœur de Montréal.',
      ctaText: 'Prendre Rendez-vous',
      ctaLink: '/fr/book',
    },
    about: {
      heading: 'Bienvenue chez Lumière',
      bodyText: 'Fondé en 2018, le Salon Lumière est un havre de tranquillité où la beauté rencontre l\'expertise. Notre équipe d\'esthéticiennes qualifiées apporte des années d\'expérience et une véritable passion pour vous aider à paraître et à vous sentir au mieux. Nous croyons au pouvoir transformateur du bien-être — chaque soin est adapté à vos besoins uniques.',
    },
    servicesShowcase: {
      heading: 'Nos Services',
      subtitle: 'Des soins du visage rajeunissants aux traitements corporels experts, découvrez notre menu de services esthétiques.',
    },
    specialistsSection: {
      heading: 'Nos Spécialistes',
      subtitle: 'Des expertes passionnées dédiées à votre beauté et votre bien-être.',
    },
    testimonials: [
      { quote: 'Lumière a transformé ma peau ! Le soin nettoyant en profondeur était exactement ce dont j\'avais besoin. Je repars toujours fraîche et confiante.', author: 'Marie-Claire L.', rating: 5 },
      { quote: 'Le meilleur lifting des cils que j\'ai jamais eu. Amélie est incroyablement talentueuse et l\'atmosphère du salon est si apaisante.', author: 'Jessica T.', rating: 5 },
      { quote: 'Je viens ici depuis plus d\'un an et la qualité est toujours constante. Le massage suédois avec Nadia est un pur bonheur.', author: 'Dominique B.', rating: 5 },
    ],
    cta: {
      heading: 'Prêt à Vous Faire Dorloter ?',
      body: 'Réservez votre rendez-vous aujourd\'hui et vivez la différence Lumière. Votre voyage vers une beauté radieuse commence ici.',
      buttonText: 'Réserver',
      buttonLink: '/fr/book',
    },
  },
}

export const siteSettingsData = {
  salonName: { en: 'Lumière Salon', fr: 'Salon Lumière' },
  address: '123 Rue de la Beauté, Montreal, QC H2X 1Y6',
  phone: '(514) 555-0123',
  email: 'info@yoursalon.com',
  socialLinks: [
    { platform: 'instagram' as const, url: '#' },
    { platform: 'facebook' as const, url: '#' },
  ],
  openingHours: [
    { day: 'monday' as const, open: '9:00', close: '19:00', closed: false },
    { day: 'tuesday' as const, open: '9:00', close: '19:00', closed: false },
    { day: 'wednesday' as const, open: '9:00', close: '19:00', closed: false },
    { day: 'thursday' as const, open: '9:00', close: '19:00', closed: false },
    { day: 'friday' as const, open: '9:00', close: '19:00', closed: false },
    { day: 'saturday' as const, open: '9:00', close: '18:00', closed: false },
    { day: 'sunday' as const, open: '', close: '', closed: true },
  ],
}
