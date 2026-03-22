export const homepageData = {
  en: {
    hero: {
      title: 'Where Elegance Meets Comfort',
      subtitle: 'Experience timeless luxury in the heart of the city. Every stay at Grand Hotel is a journey of refined indulgence.',
      ctaText: 'Reserve Your Stay',
      ctaLink: '/en/book',
    },
    about: {
      heading: 'Welcome to Grand Hotel',
      bodyText: 'Since 1928, Grand Hotel has been a beacon of hospitality and refined living. Our historic building, lovingly restored to its original grandeur, houses 85 exquisitely appointed rooms and suites. Every detail — from the Italian marble floors to the hand-selected artworks — reflects our unwavering commitment to excellence.',
    },
    roomsShowcase: {
      heading: 'Our Accommodations',
      subtitle: 'From intimate classic rooms to our breathtaking Presidential Suite, each space is designed for exceptional comfort.',
    },
    amenitiesSection: {
      heading: 'Hotel Amenities',
      subtitle: 'Everything you need for an unforgettable stay, all under one roof.',
    },
    testimonials: [
      { quote: 'An extraordinary stay from start to finish. The Deluxe Suite was impeccable, and the staff anticipated our every need. We will return.', author: 'Richard & Catherine M.', rating: 5 },
      { quote: 'The rooftop pool at sunset is worth the trip alone. Combined with the incredible restaurant and spa, this is the finest hotel we\'ve visited.', author: 'James W.', rating: 5 },
      { quote: 'We celebrated our anniversary in the Executive Suite. The private terrace, the champagne upon arrival, the attention to detail — simply perfect.', author: 'Elena & Marco R.', rating: 5 },
    ],
    cta: {
      heading: 'Begin Your Stay',
      body: 'Reserve your room today and discover why Grand Hotel has been the city\'s most cherished address for nearly a century.',
      buttonText: 'Check Availability',
      buttonLink: '/en/book',
    },
  },
  fr: {
    hero: {
      title: 'Ou l\'Elegance Rencontre le Confort',
      subtitle: 'Vivez un luxe intemporel au coeur de la ville. Chaque sejour au Grand Hotel est un voyage de raffinement.',
      ctaText: 'Reserver Votre Sejour',
      ctaLink: '/fr/book',
    },
    about: {
      heading: 'Bienvenue au Grand Hotel',
      bodyText: 'Depuis 1928, le Grand Hotel est un phare d\'hospitalite et de vie raffinee. Notre batiment historique, restaure avec amour dans sa splendeur d\'origine, abrite 85 chambres et suites amenagees avec gout. Chaque detail — des sols en marbre italien aux oeuvres d\'art selectionnees a la main — reflete notre engagement indefectible envers l\'excellence.',
    },
    roomsShowcase: {
      heading: 'Nos Hebergements',
      subtitle: 'Des chambres classiques intimes a notre suite presidentielle a couper le souffle, chaque espace est concu pour un confort exceptionnel.',
    },
    amenitiesSection: {
      heading: 'Services de l\'Hotel',
      subtitle: 'Tout ce dont vous avez besoin pour un sejour inoubliable, sous un meme toit.',
    },
    testimonials: [
      { quote: 'Un sejour extraordinaire du debut a la fin. La Suite Deluxe etait impeccable et le personnel a anticipe chacun de nos besoins. Nous reviendrons.', author: 'Richard & Catherine M.', rating: 5 },
      { quote: 'La piscine sur le toit au coucher du soleil vaut le deplacement a elle seule. Combine au restaurant et au spa incroyables, c\'est le plus bel hotel que nous ayons visite.', author: 'James W.', rating: 5 },
      { quote: 'Nous avons celebre notre anniversaire dans la Suite Executive. La terrasse privee, le champagne a l\'arrivee, l\'attention aux details — simplement parfait.', author: 'Elena & Marco R.', rating: 5 },
    ],
    cta: {
      heading: 'Commencez Votre Sejour',
      body: 'Reservez votre chambre aujourd\'hui et decouvrez pourquoi le Grand Hotel est l\'adresse la plus cherissee de la ville depuis pres d\'un siecle.',
      buttonText: 'Verifier la Disponibilite',
      buttonLink: '/fr/book',
    },
  },
}

export const siteSettingsData = {
  hotelName: { en: 'Grand Hotel', fr: 'Grand Hotel' },
  address: '1 Place de la Concorde, Paris 75008',
  phone: '+33 1 42 68 00 00',
  email: 'reservations@grandhotel.com',
  checkInTime: '15:00',
  checkOutTime: '11:00',
  socialLinks: [
    { platform: 'instagram' as const, url: '#' },
    { platform: 'facebook' as const, url: '#' },
    { platform: 'tripadvisor' as const, url: '#' },
  ],
}

// Testimonials collection data (separate from homepage global testimonials).
// `quote` is localized; `author`, `rating`, `featured` are not.
// `roomTypeKey` is the EN room type name for looking up IDs during seeding.
export const testimonialsCollectionData = [
  {
    quote: {
      en: 'An extraordinary stay. The Deluxe Suite was impeccable, and the staff anticipated our every need.',
      fr: 'Un séjour extraordinaire. La Suite Deluxe était impeccable et le personnel a anticipé chacun de nos besoins.',
    },
    author: 'Richard & Catherine M.',
    rating: 5,
    roomTypeKey: 'Deluxe Suite',
    featured: true,
  },
  {
    quote: {
      en: 'The rooftop pool at sunset is worth the trip alone. Combined with the incredible restaurant, this is the finest hotel we\'ve visited.',
      fr: 'La piscine sur le toit au coucher du soleil vaut le déplacement à elle seule. Combiné au restaurant incroyable, c\'est le plus bel hôtel que nous ayons visité.',
    },
    author: 'James W.',
    rating: 5,
    roomTypeKey: 'Superior Room',
    featured: true,
  },
  {
    quote: {
      en: 'We celebrated our anniversary in the Executive Suite. The private terrace and champagne upon arrival — simply perfect.',
      fr: 'Nous avons célébré notre anniversaire dans la Suite Exécutive. La terrasse privée et le champagne à l\'arrivée — simplement parfait.',
    },
    author: 'Elena & Marco R.',
    rating: 5,
    roomTypeKey: 'Executive Suite',
    featured: true,
  },
  {
    quote: {
      en: 'Even the Classic Room exceeded our expectations. Beautiful furnishings, impeccable service, and a view that made us never want to leave.',
      fr: 'Même la Chambre Classique a dépassé nos attentes. Un mobilier magnifique, un service impeccable et une vue qui nous a donné envie de ne jamais partir.',
    },
    author: 'Sophie L.',
    rating: 5,
    roomTypeKey: 'Classic Room',
    featured: false,
  },
]

// Gallery data. `caption` is localized; `category`, `featured` are not.
// `imageIndex` maps to the galleryImageIds array built during seeding.
export const galleryData = [
  {
    caption: {
      en: 'Our magnificent lobby',
      fr: 'Notre magnifique hall d\'entrée',
    },
    category: 'lobby' as const,
    featured: true,
    imageIndex: 0,
  },
  {
    caption: {
      en: 'Deluxe Suite bedroom',
      fr: 'Chambre de la Suite Deluxe',
    },
    category: 'rooms' as const,
    featured: true,
    imageIndex: 1,
  },
  {
    caption: {
      en: 'Rooftop dining terrace',
      fr: 'Terrasse de restauration sur le toit',
    },
    category: 'dining' as const,
    featured: false,
    imageIndex: 2,
  },
  {
    caption: {
      en: 'Grand entrance',
      fr: 'L\'entrée principale',
    },
    category: 'exterior' as const,
    featured: false,
    imageIndex: 3,
  },
]
