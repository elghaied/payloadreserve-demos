export const menuCategoriesData = [
  {
    name: { en: 'Starters', fr: 'Entrees' },
    description: {
      en: 'Artfully prepared beginnings to awaken your palate.',
      fr: 'Des debuts artistiquement prepares pour eveiller votre palais.',
    },
    imageKey: 'menuStarters' as const,
    order: 1,
    dishes: [
      {
        name: { en: 'French Onion Soup', fr: 'Soupe a l\'oignon gratinee' },
        description: { en: 'Caramelized onions, rich beef broth, Gruyere crouton', fr: 'Oignons caramelises, bouillon de boeuf, crouton au Gruyere' },
        price: 16,
        dietary: [],
      },
      {
        name: { en: 'Foie Gras Terrine', fr: 'Terrine de foie gras' },
        description: { en: 'House-made terrine with fig compote and brioche toast', fr: 'Terrine maison avec compotee de figues et toast de brioche' },
        price: 28,
        dietary: [],
      },
      {
        name: { en: 'Garden Salad', fr: 'Salade du jardin' },
        description: { en: 'Seasonal greens, shaved vegetables, herb vinaigrette', fr: 'Verdures de saison, legumes eminees, vinaigrette aux herbes' },
        price: 14,
        dietary: ['vegetarian', 'vegan', 'gluten-free'],
      },
    ],
  },
  {
    name: { en: 'Main Courses', fr: 'Plats Principaux' },
    description: {
      en: 'Masterfully crafted dishes that celebrate French culinary heritage.',
      fr: 'Des plats magistralement elabores qui celebrent le patrimoine culinaire francais.',
    },
    imageKey: 'menuMains' as const,
    order: 2,
    dishes: [
      {
        name: { en: 'Beef Bourguignon', fr: 'Boeuf Bourguignon' },
        description: { en: 'Slow-braised beef, pearl onions, mushrooms, red wine reduction', fr: 'Boeuf braise, petits oignons, champignons, reduction de vin rouge' },
        price: 38,
        dietary: ['gluten-free'],
      },
      {
        name: { en: 'Pan-Seared Duck Breast', fr: 'Magret de canard poele' },
        description: { en: 'Cherry gastrique, roasted root vegetables, pommes sarladaises', fr: 'Gastrique de cerises, legumes racines rotis, pommes sarladaises' },
        price: 42,
        dietary: ['gluten-free'],
      },
      {
        name: { en: 'Grilled Sea Bass', fr: 'Bar grille' },
        description: { en: 'Fennel puree, saffron beurre blanc, seasonal vegetables', fr: 'Puree de fenouil, beurre blanc safrane, legumes de saison' },
        price: 44,
        dietary: ['gluten-free'],
      },
      {
        name: { en: 'Mushroom Risotto', fr: 'Risotto aux champignons' },
        description: { en: 'Wild mushrooms, aged Parmesan, truffle oil, herbs', fr: 'Champignons sauvages, Parmesan affine, huile de truffe, herbes' },
        price: 32,
        dietary: ['vegetarian', 'gluten-free'],
      },
    ],
  },
  {
    name: { en: 'Desserts', fr: 'Desserts' },
    description: {
      en: 'Sweet finales that linger in memory.',
      fr: 'Des finales sucrees qui restent en memoire.',
    },
    imageKey: 'menuDesserts' as const,
    order: 3,
    dishes: [
      {
        name: { en: 'Creme Brulee', fr: 'Creme brulee' },
        description: { en: 'Madagascar vanilla, caramelized sugar crust', fr: 'Vanille de Madagascar, croute de sucre caramelise' },
        price: 14,
        dietary: ['gluten-free'],
      },
      {
        name: { en: 'Chocolate Fondant', fr: 'Fondant au chocolat' },
        description: { en: 'Dark chocolate lava cake, vanilla ice cream, gold leaf', fr: 'Gateau coulant au chocolat noir, glace vanille, feuille d\'or' },
        price: 16,
        dietary: [],
      },
      {
        name: { en: 'Tarte Tatin', fr: 'Tarte Tatin' },
        description: { en: 'Caramelized apple upside-down tart, Chantilly cream', fr: 'Tarte renversee aux pommes caramelisees, creme Chantilly' },
        price: 15,
        dietary: ['vegetarian'],
      },
    ],
  },
]
