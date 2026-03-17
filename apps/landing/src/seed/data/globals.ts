// ─── SiteSettings ─────────────────────────────────────────────────────────────

export const siteSettingsData = {
  demoDetailUi: {
    en: {
      backToDemos: 'All Demos',
      visitLiveDemo: 'Visit Live Demo ↗',
      demoComingSoon: 'Demo Coming Soon',
      requestPrivateDemo: 'Request Private Demo',
      featuresLabel: 'Features',
      screenshotsHeading: 'Screenshots',
      screenshotsComingSoon: 'Screenshots coming soon',
      screenshotsLivePromptBefore: 'Visit the',
      screenshotsLiveDemoLabel: 'live demo',
      screenshotsLivePromptAfter: 'to see it in action',
      configurationLabel: 'Configuration',
      payloadConfigFile: 'payload.config.ts',
      docsNoteBefore: 'See the',
      docsLinkLabel: 'full documentation',
      docsNoteAfter: 'for all available options.',
    },
    fr: {
      backToDemos: 'Toutes les démos',
      visitLiveDemo: 'Voir la démo en direct ↗',
      demoComingSoon: 'Démo bientôt disponible',
      requestPrivateDemo: 'Demander une démo privée',
      featuresLabel: 'Fonctionnalités',
      screenshotsHeading: "Captures d'écran",
      screenshotsComingSoon: "Captures d'écran bientôt disponibles",
      screenshotsLivePromptBefore: 'Visitez la',
      screenshotsLiveDemoLabel: 'démo en direct',
      screenshotsLivePromptAfter: 'pour la voir en action',
      configurationLabel: 'Configuration',
      payloadConfigFile: 'payload.config.ts',
      docsNoteBefore: 'Consultez la',
      docsLinkLabel: 'documentation complète',
      docsNoteAfter: 'pour toutes les options disponibles.',
    },
  },
  externalUrls: {
    github: 'https://github.com/elghaied/payload-reserve',
    docs: 'https://docs.payloadreserve.com',
    gshell: 'https://gshell.fr',
    payloadcms: 'https://payloadcms.com',
    nextjs: 'https://nextjs.org',
  },
  meta: {
    en: {
      title: 'payload-reserve | Booking & Reservation Plugin for Payload CMS',
      description:
        'Open-source reservation plugin for Payload CMS 3.x — add bookings, appointments, and scheduling to your Payload app in minutes.',
    },
    fr: {
      title: 'payload-reserve | Plugin de Réservation pour Payload CMS',
      description:
        'Plugin de réservation open-source pour Payload CMS 3.x — ajoutez des réservations, rendez-vous et planifications à votre application Payload en quelques minutes.',
    },
  },
}

// ─── Navigation ───────────────────────────────────────────────────────────────

export const navigationData = {
  en: {
    docsLabel: 'Docs',
    demosLabel: 'Demos',
    githubLabel: 'GitHub',
    requestDemoLabel: 'Request Demo',
  },
  fr: {
    docsLabel: 'Docs',
    demosLabel: 'Démos',
    githubLabel: 'GitHub',
    requestDemoLabel: 'Demander une démo',
  },
}

// ─── Footer ───────────────────────────────────────────────────────────────────

export const footerData = {
  // Not localized
  linksSection: {
    github: 'GitHub ↗',
    payloadCms: 'Payload CMS ↗',
  },
  en: {
    description: 'Open source reservation and booking plugin for Payload CMS 3.x projects.',
    copyright: '© 2026 payload-reserve. MIT License.',
    madeByLabel: 'Made by',
    builtWithLabel: 'Built with',
    andLabel: '&',
    productSection: {
      heading: 'Product',
      documentation: 'Documentation',
      liveDemo: 'Live Demo',
      features: 'Features',
    },
    demosSection: {
      heading: 'Demos',
      salon: 'Salon',
      hotel: 'Hotel',
      restaurant: 'Restaurant',
      events: 'Events',
    },
    linksSection: {
      heading: 'Links',
    },
  },
  fr: {
    description: 'Plugin de réservation open source pour les projets Payload CMS 3.x.',
    copyright: '© 2026 payload-reserve. Licence MIT.',
    madeByLabel: 'Fait par',
    builtWithLabel: 'Construit avec',
    andLabel: 'et',
    productSection: {
      heading: 'Produit',
      documentation: 'Documentation',
      liveDemo: 'Démo en direct',
      features: 'Fonctionnalités',
    },
    demosSection: {
      heading: 'Démos',
      salon: 'Salon',
      hotel: 'Hôtel',
      restaurant: 'Restaurant',
      events: 'Événements',
    },
    linksSection: {
      heading: 'Liens',
    },
  },
}

// ─── HomePage ─────────────────────────────────────────────────────────────────

export const homePageData = {
  en: {
    // SEO
    meta: {
      title: 'payload-reserve — Booking & Reservation Plugin for Payload CMS',
      description:
        'Drop-in booking, scheduling, and availability for Payload 3.x — salons, hotels, restaurants, events, and more.',
    },
    // Hero
    heroSection: {
      heroBadge: 'Payload CMS Plugin · MIT License',
      heroHeadline1: 'Reservations',
      heroHeadline2: 'for any business',
      heroSubheading:
        'Drop-in booking, scheduling, and availability for Payload 3.x — salons, hotels, restaurants, events, and more.',
      heroCtaDemos: 'See Live Demos',
      heroCtaDocs: 'Read the Docs',
      heroIndustryTags: [
        { emoji: '✂️', label: 'Salon & Spa' },
        { emoji: '🏨', label: 'Hotel' },
        { emoji: '🍽️', label: 'Restaurant' },
        { emoji: '🎪', label: 'Events' },
      ],
    },
    // Use Cases
    useCasesSection: {
      useCasesLabel: 'A few of many use cases',
      useCasesFootnote:
        'The plugin adapts to any business that needs time-based or resource-based booking.',
      useCasesItems: [
        { emoji: '✂️', label: 'Salon & Spa', description: 'Per-stylist booking with services' },
        { emoji: '🏨', label: 'Hotel', description: 'Multi-night room reservations' },
        { emoji: '🍽️', label: 'Restaurant', description: 'Table booking with party size' },
        { emoji: '🎪', label: 'Events', description: 'Capacity-limited event booking' },
      ],
    },
    // Features
    featuresSection: {
      featuresLabel: 'Features',
      featuresHeadline1: 'Everything you need,',
      featuresHeadline2: "nothing you don't",
      featuresSubheading:
        'payload-reserve handles the complex scheduling logic so you can focus on your product.',
      featuresItems: [
        {
          title: 'Configurable for Any Use Case',
          description:
            'Services, resources, and schedules adapt to salons, hotels, restaurants, venues, and anything else that takes bookings.',
        },
        {
          title: 'Calendar Admin View',
          description:
            'Month/week/day calendar replaces the default Payload list view — at-a-glance availability for the whole team.',
        },
        {
          title: 'Double-Booking Prevention',
          description:
            'Server-side conflict detection with configurable buffer times between reservations.',
        },
        {
          title: 'Three Booking Types',
          description:
            'Fixed-duration (appointment), flexible end time, or full-day bookings — set per service.',
        },
        {
          title: 'Configurable Status Machine',
          description:
            'Define your own statuses, transitions, and terminal states — e.g. pending → confirmed → completed → cancelled.',
        },
        {
          title: 'Capacity Management',
          description:
            'quantity > 1 allows concurrent bookings; per-reservation or per-guest capacity modes.',
        },
        {
          title: 'Multi-Resource Reservations',
          description:
            'A single booking can span multiple resources simultaneously via the items array.',
        },
        {
          title: 'Hooks API',
          description:
            'Seven lifecycle hooks (beforeCreate, afterConfirm, afterCancel, etc.) for plugging in email, Stripe, or any external system.',
        },
        {
          title: 'Public REST API',
          description:
            'Five pre-built endpoints: availability check, slot listing, booking creation, cancellation, and customer search.',
        },
      ],
    },
    // Demos Section
    demosSection: {
      demosLabel: 'Live Demos',
      demosHeadline: 'See it in action',
      demosSubheading:
        'Fully working demos for every industry — explore the admin panel and booking flow.',
      demosComingSoon: 'Coming Soon',
      demosExploreLabel: 'Explore Demo',
    },
    // Admin UI
    adminUiSection: {
      adminUiLabel: 'Admin Interface',
      adminUiHeadline: 'Complete booking management, built into Payload',
      adminUiSubtitle:
        'payload-reserve adds a full reservation management interface directly to your Payload CMS admin panel — calendar view, reservations list, status management, and more.',
      adminUiBrowserUrl: 'yoursite.com/admin/',
      adminUiSlides: [
        { caption: 'Calendar View - Month calendar' },
        { caption: 'Calendar View - Week calendar' },
        { caption: 'Calendar View - Day calendar' },
        { caption: 'Dashboard - Pending reservations wait for confirmation or cancellation' },
        { caption: 'Add Reservation - Create new reservations' },
        { caption: "Dashboard Module - View today's reservations at a glance" },
      ],
    },
    // Private Demo
    privateDemoSection: {
      privateDemoLabel: 'Private Demo',
      privateDemoHeadline: 'Experience the full admin panel',
      privateDemoSubtitle:
        "Request a private demo instance — you'll receive an email with login credentials for the Payload admin panel where you can add services, manage reservations, configure schedules, and see exactly how a reservation-powered website works. No technical knowledge required.",
      privateDemoCta: 'Request Private Demo',
      privateDemoAudience: 'Perfect for non-developers exploring the system',
      privateDemoPerks: [
        { text: 'Full admin panel access' },
        { text: 'Add & manage services' },
        { text: 'View & update reservations' },
        { text: 'Configure schedules & staff' },
        { text: 'Expires in 24h — no commitment' },
      ],
    },
    // Developer
    developerSection: {
      devLabel: 'Open Source',
      devHeadline: 'Build with us',
      devSubtitle:
        'payload-reserve is open-source and community-driven. Whether you want to improve the plugin or build your own booking app, here\'s where to start.',
      devNote: 'MIT licensed. PRs and feature requests welcome.',
      devCards: [
        {
          title: 'Contribute to the Plugin',
          description:
            'The core reservation engine — report bugs, request features, or submit a pull request. Every contribution helps.',
          url: 'https://github.com/elghaied/payload-reserve',
          linkLabel: 'View on GitHub',
        },
        {
          title: 'Use the Demo Templates',
          description:
            'Four ready-to-run demo apps — salon, hotel, restaurant, and events. Clone one as a starting point for your own project.',
          url: 'https://github.com/elghaied/payloadreserve-demos',
          linkLabel: 'Browse Templates',
        },
      ],
    },
    // How It Works
    howItWorksSection: {
      howLabel: 'How It Works',
      howHeadline: 'Up and running in minutes',
      howSteps: [
        {
          title: 'Install the plugin',
          description: 'Add payload-reserve to your Payload 3.x project in seconds.',
          code: 'npm install payload-reserve',
        },
        {
          title: 'Configure your resources',
          description:
            'Define bookable resources — stylists, rooms, tables, or venues — with custom availability and rules.',
          code: 'payloadReserve({ resources: [...] })',
        },
        {
          title: 'Go live',
          description:
            'Bookings appear instantly in your Payload admin. Use the REST API to power any frontend.',
          code: 'POST /api/reservations',
        },
      ],
    },
    // CTA Banner
    ctaBannerSection: {
      ctaLabel: 'Open Source · MIT License',
      ctaHeadline: 'Ready to add bookings to your Payload project?',
      ctaSubtitle:
        'Try a live demo or dive into the documentation to see how fast you can get up and running.',
      ctaButtonDocs: 'Read the Docs',
      ctaButtonGithub: 'View on GitHub',
    },
  },

  fr: {
    // SEO
    meta: {
      title: 'payload-reserve — Plugin de Réservation pour Payload CMS',
      description:
        'Réservation, planification et disponibilité clés-en-main pour Payload 3.x — salons, hôtels, restaurants, événements et plus encore.',
    },
    // Hero
    heroSection: {
      heroBadge: 'Plugin Payload CMS · Licence MIT',
      heroHeadline1: 'Réservations',
      heroHeadline2: 'pour chaque activité',
      heroSubheading:
        'Réservation, planification et disponibilité clés-en-main pour Payload 3.x — salons, hôtels, restaurants, événements et plus encore.',
      heroCtaDemos: 'Voir les démos',
      heroCtaDocs: 'Lire la documentation',
      heroIndustryTags: [
        { emoji: '✂️', label: 'Salon & Spa' },
        { emoji: '🏨', label: 'Hôtel' },
        { emoji: '🍽️', label: 'Restaurant' },
        { emoji: '🎪', label: 'Événements' },
      ],
    },
    // Use Cases
    useCasesSection: {
      useCasesLabel: "Quelques cas d'usage parmi d'autres",
      useCasesFootnote:
        "Le plugin s'adapte à toute activité nécessitant des réservations basées sur le temps ou les ressources.",
      useCasesItems: [
        { emoji: '✂️', label: 'Salon & Spa', description: 'Réservation par styliste avec services' },
        { emoji: '🏨', label: 'Hôtel', description: 'Réservations de chambre multi-nuits' },
        {
          emoji: '🍽️',
          label: 'Restaurant',
          description: 'Réservation de table avec taille du groupe',
        },
        {
          emoji: '🎪',
          label: 'Événements',
          description: "Réservation d'événements à capacité limitée",
        },
      ],
    },
    // Features
    featuresSection: {
      featuresLabel: 'Fonctionnalités',
      featuresHeadline1: 'Tout ce dont vous avez besoin,',
      featuresHeadline2: 'rien de superflu',
      featuresSubheading:
        'payload-reserve gère la logique complexe de planification pour que vous puissiez vous concentrer sur votre produit.',
      featuresItems: [
        {
          title: "Configurable pour tout cas d'usage",
          description:
            "Services, ressources et plannings s'adaptent aux salons, hôtels, restaurants, salles de spectacle, et toute activité prenant des réservations.",
        },
        {
          title: 'Vue calendrier admin',
          description:
            "Un calendrier mois/semaine/jour remplace la vue liste par défaut de Payload — disponibilité en un coup d'œil pour toute l'équipe.",
        },
        {
          title: 'Prévention des doubles réservations',
          description:
            'Détection de conflits côté serveur avec des temps tampon configurables entre les réservations.',
        },
        {
          title: 'Trois types de réservations',
          description:
            'Durée fixe (rendez-vous), heure de fin flexible, ou réservations à la journée — défini par service.',
        },
        {
          title: 'Machine à états configurable',
          description:
            'Définissez vos propres statuts, transitions et états terminaux — ex. en attente → confirmé → terminé → annulé.',
        },
        {
          title: 'Gestion des capacités',
          description:
            'quantity > 1 permet des réservations simultanées ; modes de capacité par réservation ou par client.',
        },
        {
          title: 'Réservations multi-ressources',
          description:
            'Une seule réservation peut couvrir plusieurs ressources simultanément via le tableau items.',
        },
        {
          title: 'API de hooks',
          description:
            'Sept hooks de cycle de vie (beforeCreate, afterConfirm, afterCancel, etc.) pour connecter e-mail, Stripe ou tout système externe.',
        },
        {
          title: 'API REST publique',
          description:
            'Cinq endpoints pré-construits : vérification de disponibilité, liste des créneaux, création, annulation et recherche client.',
        },
      ],
    },
    // Demos Section
    demosSection: {
      demosLabel: 'Démos en direct',
      demosHeadline: 'Voyez-le en action',
      demosSubheading:
        "Démos entièrement fonctionnelles pour chaque secteur — explorez le panneau admin et le parcours de réservation.",
      demosComingSoon: 'Bientôt disponible',
      demosExploreLabel: 'Explorer la démo',
    },
    // Admin UI
    adminUiSection: {
      adminUiLabel: "Interface d'administration",
      adminUiHeadline: 'Gestion complète des réservations, intégrée à Payload',
      adminUiSubtitle:
        "payload-reserve ajoute une interface de gestion des réservations complète directement dans votre panneau admin Payload CMS — vue calendrier, liste des réservations, gestion des statuts, et plus encore.",
      adminUiBrowserUrl: 'votresite.com/admin/',
      adminUiSlides: [
        { caption: 'Vue calendrier - Mois' },
        { caption: 'Vue calendrier - Semaine' },
        { caption: 'Vue calendrier - Jour' },
        {
          caption:
            'Tableau de bord - Les réservations en attente attendent une confirmation ou une annulation',
        },
        { caption: 'Ajouter une réservation - Créer de nouvelles réservations' },
        { caption: "Module tableau de bord - Voir les réservations du jour en un coup d'œil" },
      ],
    },
    // Private Demo
    privateDemoSection: {
      privateDemoLabel: 'Démo privée',
      privateDemoHeadline: 'Découvrez le panneau admin complet',
      privateDemoSubtitle:
        "Demandez une instance de démo privée — vous recevrez un e-mail avec les identifiants de connexion au panneau admin Payload où vous pourrez ajouter des services, gérer des réservations, configurer des plannings et voir exactement comment fonctionne un site alimenté par des réservations. Aucune compétence technique requise.",
      privateDemoCta: 'Demander une démo privée',
      privateDemoAudience: 'Idéal pour les non-développeurs qui explorent le système',
      privateDemoPerks: [
        { text: 'Accès complet au panneau admin' },
        { text: 'Ajouter et gérer des services' },
        { text: 'Voir et mettre à jour les réservations' },
        { text: 'Configurer les plannings et le personnel' },
        { text: 'Expire en 24h — sans engagement' },
      ],
    },
    // Developer
    developerSection: {
      devLabel: 'Open Source',
      devHeadline: 'Construisons ensemble',
      devSubtitle:
        'payload-reserve est open-source et porté par sa communauté. Que vous souhaitiez améliorer le plugin ou créer votre propre application de réservation, voici par où commencer.',
      devNote: 'Licence MIT. PRs et demandes de fonctionnalités bienvenues.',
      devCards: [
        {
          title: 'Contribuer au plugin',
          description:
            'Le moteur de réservation principal — signalez des bugs, proposez des fonctionnalités ou soumettez une pull request. Chaque contribution compte.',
          url: 'https://github.com/elghaied/payload-reserve',
          linkLabel: 'Voir sur GitHub',
        },
        {
          title: 'Utiliser les templates de démo',
          description:
            'Quatre applications de démo prêtes à lancer — salon, hôtel, restaurant et événements. Clonez-en une comme point de départ pour votre projet.',
          url: 'https://github.com/elghaied/payloadreserve-demos',
          linkLabel: 'Parcourir les templates',
        },
      ],
    },
    // How It Works
    howItWorksSection: {
      howLabel: 'Comment ça marche',
      howHeadline: 'Opérationnel en quelques minutes',
      howSteps: [
        {
          title: 'Installer le plugin',
          description: 'Ajoutez payload-reserve à votre projet Payload 3.x en quelques secondes.',
          code: 'npm install payload-reserve',
        },
        {
          title: 'Configurer vos ressources',
          description:
            'Définissez des ressources réservables — stylistes, chambres, tables ou salles — avec disponibilités et règles personnalisées.',
          code: 'payloadReserve({ resources: [...] })',
        },
        {
          title: 'Mettre en ligne',
          description:
            "Les réservations apparaissent instantanément dans votre admin Payload. Utilisez l'API REST pour alimenter n'importe quel frontend.",
          code: 'POST /api/reservations',
        },
      ],
    },
    // CTA Banner
    ctaBannerSection: {
      ctaLabel: 'Open Source · Licence MIT',
      ctaHeadline: 'Prêt à ajouter des réservations à votre projet Payload ?',
      ctaSubtitle:
        'Essayez une démo en direct ou plongez dans la documentation pour voir à quelle vitesse vous pouvez démarrer.',
      ctaButtonDocs: 'Lire la documentation',
      ctaButtonGithub: 'Voir sur GitHub',
    },
  },
}
