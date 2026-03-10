export const teamData = [
  {
    name: 'Chef Laurent Beaumont',
    role: 'head-chef' as const,
    imageKey: 'chefHead' as const,
    bio: {
      en: 'With over 25 years of experience in Michelin-starred kitchens across France, Chef Beaumont brings a philosophy of respecting tradition while embracing innovation. Trained under Alain Ducasse, he has led Le Jardin Doré\'s kitchen since 2005.',
      fr: 'Fort de plus de 25 ans d\'expérience dans des cuisines étoilées à travers la France, le Chef Beaumont apporte une philosophie de respect de la tradition tout en embrassant l\'innovation. Formé auprès d\'Alain Ducasse, il dirige la cuisine du Jardin Doré depuis 2005.',
    },
    specialty: { en: 'Classical French sauces & seasonal menus', fr: 'Sauces classiques françaises et menus de saison' },
    signatureDish: { en: 'Pan-Seared Duck Breast with Cherry Gastrique', fr: 'Magret de canard poêlé, gastrique de cerises' },
    awards: [
      { title: 'Meilleur Ouvrier de France', year: 2012 },
      { title: 'Gault & Millau Chef of the Year', year: 2018 },
    ],
    order: 1,
  },
  {
    name: 'Sophie Marchand',
    role: 'sous-chef' as const,
    imageKey: 'chefSous' as const,
    bio: {
      en: 'A rising star of French gastronomy, Sophie brings creativity and precision to every plate. Her background in molecular gastronomy adds a modern edge to the classic Jardin Doré menu.',
      fr: 'Étoile montante de la gastronomie française, Sophie apporte créativité et précision à chaque assiette. Sa formation en gastronomie moléculaire ajoute une touche moderne au menu classique du Jardin Doré.',
    },
    specialty: { en: 'Modern French techniques & plating', fr: 'Techniques françaises modernes et dressage' },
    signatureDish: { en: 'Pan-Seared Scallops with Truffle Vinaigrette', fr: 'Saint-Jacques poêlées, vinaigrette à la truffe' },
    awards: [
      { title: 'Les Étoiles de Mougins - Silver', year: 2020 },
    ],
    order: 2,
  },
  {
    name: 'Pierre Delacroix',
    role: 'pastry-chef' as const,
    imageKey: 'chefPastry' as const,
    bio: {
      en: 'Pierre\'s desserts are legendary in Paris. Trained at Le Cordon Bleu and with a decade at Ladurée, his creations balance artistry with the warmth of homestyle French pâtisserie.',
      fr: 'Les desserts de Pierre sont légendaires à Paris. Formé au Cordon Bleu et fort d\'une décennie chez Ladurée, ses créations allient l\'art à la chaleur de la pâtisserie française familiale.',
    },
    specialty: { en: 'French pâtisserie & chocolate work', fr: 'Pâtisserie française et travail du chocolat' },
    signatureDish: { en: 'Chocolate Fondant with Gold Leaf', fr: 'Fondant au chocolat à la feuille d\'or' },
    awards: [
      { title: 'World Pastry Cup - Bronze', year: 2016 },
    ],
    order: 3,
  },
  {
    name: 'Isabelle Rousseau',
    role: 'sommelier' as const,
    imageKey: 'sommelier' as const,
    bio: {
      en: 'Isabelle curates one of the most celebrated wine lists in Paris. With certifications from the Court of Master Sommeliers and an encyclopedic knowledge of French vineyards, she creates pairings that elevate every dining experience.',
      fr: 'Isabelle gère l\'une des cartes des vins les plus célébrées de Paris. Avec ses certifications de la Court of Master Sommeliers et une connaissance encyclopédique des vignobles français, elle crée des accords qui subliment chaque expérience.',
    },
    specialty: { en: 'Burgundy & natural wines', fr: 'Bourgogne et vins naturels' },
    signatureDish: { en: 'Curated wine flight pairings', fr: 'Accords mets-vins sur mesure' },
    awards: [
      { title: 'Best Sommelier of France - Finalist', year: 2019 },
    ],
    order: 4,
  },
  {
    name: 'Antoine Lefevre',
    role: 'maitre-d' as const,
    imageKey: 'maitreD' as const,
    bio: {
      en: 'Antoine has orchestrated the front of house at Le Jardin Doré for over a decade. His impeccable attention to detail and genuine warmth ensure every guest feels like royalty from the moment they arrive.',
      fr: 'Antoine orchestre la salle du Jardin Doré depuis plus d\'une décennie. Son attention impeccable aux détails et sa chaleur sincère font que chaque convive se sent comme un roi dès son arrivée.',
    },
    specialty: { en: 'Guest experience & event coordination', fr: 'Expérience client et coordination événementielle' },
    signatureDish: { en: 'Tableside flambé service', fr: 'Service flambé en salle' },
    awards: [],
    order: 5,
  },
]
