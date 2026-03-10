import type { CollectionConfig } from 'payload'

export const WineList: CollectionConfig = {
  slug: 'wine-list',
  admin: {
    useAsTitle: 'name',
    group: 'Restaurant',
    defaultColumns: ['name', 'type', 'region', 'priceBottle'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: { description: 'e.g. "Château Margaux 2015"' },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Red', value: 'red' },
        { label: 'White', value: 'white' },
        { label: 'Rosé', value: 'rose' },
        { label: 'Champagne', value: 'champagne' },
        { label: 'Dessert Wine', value: 'dessert' },
      ],
    },
    {
      name: 'region',
      type: 'text',
      required: true,
      admin: { description: 'e.g. "Bordeaux, France" or "Tuscany, Italy"' },
    },
    {
      name: 'vintage',
      type: 'number',
      admin: { description: 'Year of production' },
    },
    {
      name: 'grape',
      type: 'text',
      admin: { description: 'e.g. "Cabernet Sauvignon / Merlot blend"' },
    },
    {
      name: 'tastingNotes',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'pairingNotes',
      type: 'textarea',
      localized: true,
      admin: { description: 'What dishes this wine pairs well with' },
    },
    {
      name: 'priceGlass',
      type: 'number',
      min: 0,
      admin: { description: 'Price per glass (leave empty if bottle only)' },
    },
    {
      name: 'priceBottle',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Show on homepage wine section' },
    },
  ],
}
