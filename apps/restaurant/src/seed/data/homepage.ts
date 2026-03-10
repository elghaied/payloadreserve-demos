export const homepageData = {
  en: {
    hero: {
      title: 'Le Jardin Dore',
      subtitle: 'Where Culinary Art Meets Garden Elegance',
      ctaText: 'Reserve a Table',
      ctaLink: '/en/book',
    },
    about: {
      heading: 'A Tradition of Excellence',
      bodyText:
        'Nestled in a historic Parisian courtyard, Le Jardin Dore has been a destination for discerning diners since 1987. Our chef draws inspiration from classical French cuisine while embracing the finest seasonal ingredients. Whether you choose to dine in our elegant interior or beneath the wisteria on our garden terrace, every meal here is a celebration of taste and beauty.',
    },
    menuShowcase: {
      heading: 'Our Menu',
      subtitle: 'Seasonal creations inspired by the finest French traditions',
    },
    experiences: {
      heading: 'Dining Experiences',
      subtitle: 'From intimate lunches to grand tasting menus, find the perfect experience',
    },
    testimonials: [
      {
        quote: 'An unforgettable evening. The tasting menu was a journey through flavors I have never experienced before.',
        author: 'Marie-Claire Beaumont',
        rating: 5,
      },
      {
        quote: 'The terrace in summer is pure magic. Excellent wine list and impeccable service.',
        author: 'Philippe Durand',
        rating: 5,
      },
      {
        quote: 'Best Sunday brunch in Paris. The pastries are divine and the garden setting is enchanting.',
        author: 'Sophie Laurent',
        rating: 5,
      },
    ],
    cta: {
      heading: 'Join Us for an Extraordinary Meal',
      body: 'Book your table today and discover why Le Jardin Dore has been a Parisian favorite for over three decades.',
      buttonText: 'Reserve Now',
      buttonLink: '/en/book',
    },
  },
  fr: {
    hero: {
      title: 'Le Jardin Dore',
      subtitle: 'Ou l\'art culinaire rencontre l\'elegance du jardin',
      ctaText: 'Reserver une table',
      ctaLink: '/fr/book',
    },
    about: {
      heading: 'Une tradition d\'excellence',
      bodyText:
        'Niche dans une cour historique parisienne, Le Jardin Dore est une destination pour les gastronomes avertis depuis 1987. Notre chef puise son inspiration dans la cuisine classique francaise tout en privilegiant les meilleurs ingredients de saison. Que vous choisissiez de diner dans notre interieur elegant ou sous la glycine de notre terrasse-jardin, chaque repas ici est une celebration du gout et de la beaute.',
    },
    menuShowcase: {
      heading: 'Notre carte',
      subtitle: 'Creations de saison inspirees des plus belles traditions francaises',
    },
    experiences: {
      heading: 'Experiences culinaires',
      subtitle: 'Des dejeuners intimes aux grands menus degustation, trouvez l\'experience parfaite',
    },
    testimonials: [
      {
        quote: 'Une soiree inoubliable. Le menu degustation etait un voyage a travers des saveurs jamais experimentees.',
        author: 'Marie-Claire Beaumont',
        rating: 5,
      },
      {
        quote: 'La terrasse en ete est magique. Excellente carte des vins et service impeccable.',
        author: 'Philippe Durand',
        rating: 5,
      },
      {
        quote: 'Le meilleur brunch du dimanche a Paris. Les patisseries sont divines et le cadre du jardin est enchanteur.',
        author: 'Sophie Laurent',
        rating: 5,
      },
    ],
    cta: {
      heading: 'Rejoignez-nous pour un repas extraordinaire',
      body: 'Reservez votre table aujourd\'hui et decouvrez pourquoi Le Jardin Dore est un favori parisien depuis plus de trois decennies.',
      buttonText: 'Reserver maintenant',
      buttonLink: '/fr/book',
    },
  },
}

export const siteSettingsData = {
  en: {
    restaurantName: 'Le Jardin Dore',
    address: '42 Rue des Jardins, 75004 Paris, France',
    phone: '+33 1 42 78 55 00',
    email: 'reservations@lejardin.com',
    socialLinks: [
      { platform: 'instagram', url: 'https://instagram.com/lejardindore' },
      { platform: 'facebook', url: 'https://facebook.com/lejardindore' },
      { platform: 'tripadvisor', url: 'https://tripadvisor.com/lejardindore' },
    ],
    serviceHours: [
      { service: 'lunch', days: 'Monday - Saturday', startTime: '11:30', endTime: '14:30' },
      { service: 'dinner', days: 'Monday - Saturday', startTime: '18:00', endTime: '22:30' },
      { service: 'brunch', days: 'Sunday', startTime: '10:00', endTime: '14:00' },
      { service: 'bar', days: 'Monday - Saturday', startTime: '17:00', endTime: '23:30' },
    ],
  },
  fr: {
    restaurantName: 'Le Jardin Dore',
  },
}
