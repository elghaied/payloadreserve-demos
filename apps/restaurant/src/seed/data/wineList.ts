export const wineListData = [
  // Reds
  {
    name: 'Château Margaux 2016',
    type: 'red' as const,
    region: 'Bordeaux, France',
    vintage: 2016,
    grape: 'Cabernet Sauvignon / Merlot',
    tastingNotes: {
      en: 'Elegant and complex with notes of blackcurrant, violet, and cedar. Silky tannins with a remarkably long finish.',
      fr: 'Élégant et complexe avec des notes de cassis, violette et cèdre. Tanins soyeux avec une finale remarquablement longue.',
    },
    pairingNotes: {
      en: 'Pairs beautifully with our Rack of Lamb or Pan-Seared Duck Breast.',
      fr: 'S\'accorde magnifiquement avec notre Carré d\'agneau ou Magret de canard.',
    },
    priceGlass: 32,
    priceBottle: 185,
    featured: true,
  },
  {
    name: 'Domaine de la Romanée-Conti Échezeaux 2018',
    type: 'red' as const,
    region: 'Burgundy, France',
    vintage: 2018,
    grape: 'Pinot Noir',
    tastingNotes: {
      en: 'Sublime complexity of red fruits, spice, and earthy minerality. Ethereal and profound.',
      fr: 'Complexité sublime de fruits rouges, épices et minéralité terreuse. Éthéré et profond.',
    },
    pairingNotes: {
      en: 'Perfect with our Beef Bourguignon or the Cheese Board.',
      fr: 'Parfait avec notre Bœuf Bourguignon ou le Plateau de fromages.',
    },
    priceGlass: null,
    priceBottle: 420,
    featured: true,
  },
  {
    name: 'Côtes du Rhône Villages 2020',
    type: 'red' as const,
    region: 'Rhône Valley, France',
    vintage: 2020,
    grape: 'Grenache / Syrah / Mourvèdre',
    tastingNotes: {
      en: 'Rich and generous with dark berry fruit, garrigue herbs, and a touch of black pepper.',
      fr: 'Riche et généreux avec des fruits noirs, herbes de garrigue et une touche de poivre noir.',
    },
    pairingNotes: {
      en: 'Excellent with hearty mains or the Mushroom Risotto.',
      fr: 'Excellent avec les plats robustes ou le Risotto aux champignons.',
    },
    priceGlass: 14,
    priceBottle: 52,
    featured: false,
  },
  // Whites
  {
    name: 'Chablis Premier Cru "Montmains" 2021',
    type: 'white' as const,
    region: 'Burgundy, France',
    vintage: 2021,
    grape: 'Chardonnay',
    tastingNotes: {
      en: 'Pure and mineral with citrus, green apple, and a flinty finish. Beautifully balanced acidity.',
      fr: 'Pur et minéral avec des notes d\'agrumes, pomme verte et une finale de pierre à fusil.',
    },
    pairingNotes: {
      en: 'Ideal with our Grilled Sea Bass or Pan-Seared Scallops.',
      fr: 'Idéal avec notre Bar grillé ou les Saint-Jacques poêlées.',
    },
    priceGlass: 18,
    priceBottle: 68,
    featured: true,
  },
  {
    name: 'Sancerre "Les Monts Damnés" 2022',
    type: 'white' as const,
    region: 'Loire Valley, France',
    vintage: 2022,
    grape: 'Sauvignon Blanc',
    tastingNotes: {
      en: 'Vibrant and aromatic with grapefruit, white flowers, and a chalky minerality.',
      fr: 'Vibrant et aromatique avec pamplemousse, fleurs blanches et une minéralité crayeuse.',
    },
    pairingNotes: {
      en: 'Wonderful with our Garden Salad or Lobster Thermidor.',
      fr: 'Merveilleux avec notre Salade du jardin ou le Homard Thermidor.',
    },
    priceGlass: 16,
    priceBottle: 58,
    featured: false,
  },
  {
    name: 'Puligny-Montrachet 2020',
    type: 'white' as const,
    region: 'Burgundy, France',
    vintage: 2020,
    grape: 'Chardonnay',
    tastingNotes: {
      en: 'Opulent with notes of white peach, hazelnut, and a creamy texture balanced by bright acidity.',
      fr: 'Opulent avec des notes de pêche blanche, noisette et une texture crémeuse équilibrée par une acidité vive.',
    },
    pairingNotes: {
      en: 'Sublime with Lobster Thermidor or the Foie Gras Terrine.',
      fr: 'Sublime avec le Homard Thermidor ou la Terrine de foie gras.',
    },
    priceGlass: 24,
    priceBottle: 95,
    featured: false,
  },
  // Rosé
  {
    name: 'Domaines Ott Château de Selle 2023',
    type: 'rose' as const,
    region: 'Provence, France',
    vintage: 2023,
    grape: 'Grenache / Cinsault',
    tastingNotes: {
      en: 'Pale salmon color, delicate aromas of peach and white flowers. Crisp and refreshing.',
      fr: 'Couleur saumon pâle, arômes délicats de pêche et fleurs blanches. Vif et rafraîchissant.',
    },
    pairingNotes: {
      en: 'Perfect for Sunday Brunch or as an aperitif on the terrace.',
      fr: 'Parfait pour le Brunch du dimanche ou en apéritif sur la terrasse.',
    },
    priceGlass: 15,
    priceBottle: 55,
    featured: false,
  },
  // Champagne
  {
    name: 'Dom Pérignon 2013',
    type: 'champagne' as const,
    region: 'Champagne, France',
    vintage: 2013,
    grape: 'Chardonnay / Pinot Noir',
    tastingNotes: {
      en: 'Extraordinary depth with brioche, white flowers, and a vibrant effervescence. Seamless and timeless.',
      fr: 'Profondeur extraordinaire avec brioche, fleurs blanches et une effervescence vibrante. Harmonieux et intemporel.',
    },
    pairingNotes: {
      en: 'Celebratory moments, or pair with our Foie Gras Terrine.',
      fr: 'Moments de célébration, ou à accorder avec notre Terrine de foie gras.',
    },
    priceGlass: null,
    priceBottle: 280,
    featured: true,
  },
  {
    name: 'Ruinart Blanc de Blancs NV',
    type: 'champagne' as const,
    region: 'Champagne, France',
    vintage: null,
    grape: 'Chardonnay',
    tastingNotes: {
      en: 'Fresh and elegant with citrus, white peach, and toasted almond notes. Fine persistent bubbles.',
      fr: 'Frais et élégant avec des notes d\'agrumes, pêche blanche et amande grillée. Bulles fines et persistantes.',
    },
    pairingNotes: {
      en: 'Ideal aperitif or with lighter starters.',
      fr: 'Apéritif idéal ou avec les entrées légères.',
    },
    priceGlass: 22,
    priceBottle: 95,
    featured: false,
  },
  // Dessert Wine
  {
    name: 'Château d\'Yquem 2017',
    type: 'dessert' as const,
    region: 'Sauternes, Bordeaux, France',
    vintage: 2017,
    grape: 'Sémillon / Sauvignon Blanc',
    tastingNotes: {
      en: 'Liquid gold with apricot, honey, and tropical notes. Luscious sweetness balanced by vibrant acidity.',
      fr: 'Or liquide avec des notes d\'abricot, miel et tropicales. Douceur voluptueuse équilibrée par une acidité vibrante.',
    },
    pairingNotes: {
      en: 'Divine with Foie Gras Terrine or alongside our Cheese Board.',
      fr: 'Divin avec la Terrine de foie gras ou accompagné de notre Plateau de fromages.',
    },
    priceGlass: 38,
    priceBottle: 450,
    featured: true,
  },
]
