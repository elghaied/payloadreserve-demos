export const menuData = [
  {
    name: { en: 'Starters', fr: 'Entrées' },
    description: {
      en: 'Artfully prepared beginnings to awaken your palate.',
      fr: 'Des débuts artistiquement préparés pour éveiller votre palais.',
    },
    imageKey: 'menuStarters' as const,
    order: 1,
    dishes: [
      {
        name: { en: 'French Onion Soup', fr: 'Soupe à l\'oignon gratinée' },
        description: { en: 'Caramelized onions, rich beef broth, Gruyère crouton', fr: 'Oignons caramélisés, bouillon de bœuf, croûton au Gruyère' },
        price: 16,
        dietary: [],
        seasonal: false,
        chefRecommendation: false,
        winePairingIndex: null,
      },
      {
        name: { en: 'Foie Gras Terrine', fr: 'Terrine de foie gras' },
        description: { en: 'House-made terrine with fig compote and brioche toast', fr: 'Terrine maison avec compotée de figues et toast de brioche' },
        price: 28,
        dietary: [],
        seasonal: false,
        chefRecommendation: true,
        winePairingIndex: 9, // Château d'Yquem (dessert wine)
      },
      {
        name: { en: 'Garden Salad', fr: 'Salade du jardin' },
        description: { en: 'Seasonal greens, shaved vegetables, herb vinaigrette', fr: 'Verdures de saison, légumes éminés, vinaigrette aux herbes' },
        price: 14,
        dietary: ['vegetarian', 'vegan', 'gluten-free'],
        seasonal: true,
        chefRecommendation: false,
        winePairingIndex: 4, // Sancerre
      },
      {
        name: { en: 'Burrata & Heirloom Tomatoes', fr: 'Burrata et tomates anciennes' },
        description: { en: 'Creamy burrata, vine-ripened tomatoes, basil oil, aged balsamic', fr: 'Burrata crémeuse, tomates mûries sur vigne, huile de basilic, balsamique vieilli' },
        price: 19,
        dietary: ['vegetarian', 'gluten-free'],
        seasonal: true,
        chefRecommendation: true,
        winePairingIndex: 6, // Rosé
      },
    ],
  },
  {
    name: { en: 'Fish & Seafood', fr: 'Poissons et fruits de mer' },
    description: {
      en: 'The finest catch from the Atlantic and Mediterranean.',
      fr: 'Les meilleures prises de l\'Atlantique et de la Méditerranée.',
    },
    imageKey: 'menuMains' as const,
    order: 2,
    dishes: [
      {
        name: { en: 'Grilled Sea Bass', fr: 'Bar grillé' },
        description: { en: 'Fennel purée, saffron beurre blanc, seasonal vegetables', fr: 'Purée de fenouil, beurre blanc safrané, légumes de saison' },
        price: 44,
        dietary: ['gluten-free'],
        seasonal: false,
        chefRecommendation: true,
        winePairingIndex: 3, // Chablis Premier Cru
      },
      {
        name: { en: 'Lobster Thermidor', fr: 'Homard Thermidor' },
        description: { en: 'Half lobster, cognac cream sauce, Gruyère gratin', fr: 'Demi-homard, sauce crémée au cognac, gratin de Gruyère' },
        price: 58,
        dietary: [],
        seasonal: false,
        chefRecommendation: false,
        winePairingIndex: 5, // Puligny-Montrachet
      },
      {
        name: { en: 'Pan-Seared Scallops', fr: 'Saint-Jacques poêlées' },
        description: { en: 'Cauliflower purée, truffle vinaigrette, crispy pancetta', fr: 'Purée de chou-fleur, vinaigrette à la truffe, pancetta croustillante' },
        price: 38,
        dietary: ['gluten-free'],
        seasonal: true,
        chefRecommendation: true,
        winePairingIndex: 3, // Chablis Premier Cru
      },
    ],
  },
  {
    name: { en: 'Main Courses', fr: 'Plats Principaux' },
    description: {
      en: 'Masterfully crafted dishes that celebrate French culinary heritage.',
      fr: 'Des plats magistralement élaborés qui célèbrent le patrimoine culinaire français.',
    },
    imageKey: 'menuMains' as const,
    order: 3,
    dishes: [
      {
        name: { en: 'Beef Bourguignon', fr: 'Bœuf Bourguignon' },
        description: { en: 'Slow-braised beef, pearl onions, mushrooms, red wine reduction', fr: 'Bœuf braisé, petits oignons, champignons, réduction de vin rouge' },
        price: 38,
        dietary: ['gluten-free'],
        seasonal: false,
        chefRecommendation: false,
        winePairingIndex: 1, // DRC Échezeaux
      },
      {
        name: { en: 'Pan-Seared Duck Breast', fr: 'Magret de canard poêlé' },
        description: { en: 'Cherry gastrique, roasted root vegetables, pommes sarladaises', fr: 'Gastrique de cerises, légumes racines rôtis, pommes sarladaises' },
        price: 42,
        dietary: ['gluten-free'],
        seasonal: false,
        chefRecommendation: true,
        winePairingIndex: 0, // Château Margaux
      },
      {
        name: { en: 'Mushroom Risotto', fr: 'Risotto aux champignons' },
        description: { en: 'Wild mushrooms, aged Parmesan, truffle oil, herbs', fr: 'Champignons sauvages, Parmesan affiné, huile de truffe, herbes' },
        price: 32,
        dietary: ['vegetarian', 'gluten-free'],
        seasonal: false,
        chefRecommendation: false,
        winePairingIndex: 2, // Côtes du Rhône
      },
      {
        name: { en: 'Rack of Lamb', fr: 'Carré d\'agneau' },
        description: { en: 'Herb-crusted, ratatouille, rosemary jus', fr: 'En croûte d\'herbes, ratatouille, jus au romarin' },
        price: 46,
        dietary: ['gluten-free'],
        seasonal: false,
        chefRecommendation: true,
        winePairingIndex: 0, // Château Margaux
      },
    ],
  },
  {
    name: { en: 'Cheese', fr: 'Fromages' },
    description: {
      en: 'A curated selection of artisanal French cheeses.',
      fr: 'Une sélection de fromages artisanaux français.',
    },
    imageKey: 'menuDesserts' as const,
    order: 4,
    dishes: [
      {
        name: { en: 'Cheese Board (3 selections)', fr: 'Plateau de fromages (3 choix)' },
        description: { en: 'Daily selection of aged and soft cheeses, honeycomb, walnut bread', fr: 'Sélection du jour de fromages affinés et frais, rayon de miel, pain aux noix' },
        price: 18,
        dietary: ['vegetarian'],
        seasonal: false,
        chefRecommendation: false,
        winePairingIndex: 1, // DRC Échezeaux
      },
      {
        name: { en: 'Cheese Board (5 selections)', fr: 'Plateau de fromages (5 choix)' },
        description: { en: 'Extended selection with seasonal accompaniments', fr: 'Sélection étendue avec accompagnements de saison' },
        price: 26,
        dietary: ['vegetarian'],
        seasonal: false,
        chefRecommendation: true,
        winePairingIndex: 9, // Château d'Yquem
      },
    ],
  },
  {
    name: { en: 'Desserts', fr: 'Desserts' },
    description: {
      en: 'Sweet finales that linger in memory.',
      fr: 'Des finales sucrées qui restent en mémoire.',
    },
    imageKey: 'menuDesserts' as const,
    order: 5,
    dishes: [
      {
        name: { en: 'Crème Brûlée', fr: 'Crème brûlée' },
        description: { en: 'Madagascar vanilla, caramelized sugar crust', fr: 'Vanille de Madagascar, croûte de sucre caramélisé' },
        price: 14,
        dietary: ['gluten-free'],
        seasonal: false,
        chefRecommendation: false,
        winePairingIndex: 9, // Château d'Yquem
      },
      {
        name: { en: 'Chocolate Fondant', fr: 'Fondant au chocolat' },
        description: { en: 'Dark chocolate lava cake, vanilla ice cream, gold leaf', fr: 'Gâteau coulant au chocolat noir, glace vanille, feuille d\'or' },
        price: 16,
        dietary: [],
        seasonal: false,
        chefRecommendation: true,
        winePairingIndex: null,
      },
      {
        name: { en: 'Tarte Tatin', fr: 'Tarte Tatin' },
        description: { en: 'Caramelized apple upside-down tart, Chantilly cream', fr: 'Tarte renversée aux pommes caramélisées, crème Chantilly' },
        price: 15,
        dietary: ['vegetarian'],
        seasonal: true,
        chefRecommendation: false,
        winePairingIndex: null,
      },
      {
        name: { en: 'Île Flottante', fr: 'Île flottante' },
        description: { en: 'Poached meringue, vanilla crème anglaise, spun caramel', fr: 'Meringue pochée, crème anglaise vanillée, caramel filé' },
        price: 14,
        dietary: ['gluten-free'],
        seasonal: false,
        chefRecommendation: false,
        winePairingIndex: null,
      },
    ],
  },
]
