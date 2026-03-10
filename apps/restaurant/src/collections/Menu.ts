import type { CollectionConfig } from 'payload'

export const Menu: CollectionConfig = {
  slug: 'menu',
  admin: {
    useAsTitle: 'name',
    group: 'Restaurant',
    defaultColumns: ['name', 'order'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
      admin: { description: 'Course name (e.g. Starters, Mains, Cheese, Desserts)' },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'dishes',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
        },
        {
          name: 'price',
          type: 'number',
          required: true,
          min: 0,
        },
        {
          name: 'dietary',
          type: 'select',
          hasMany: true,
          options: [
            { label: 'Vegetarian', value: 'vegetarian' },
            { label: 'Vegan', value: 'vegan' },
            { label: 'Gluten-Free', value: 'gluten-free' },
            { label: 'Dairy-Free', value: 'dairy-free' },
            { label: 'Nut-Free', value: 'nut-free' },
          ],
        },
        {
          name: 'seasonal',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Mark as seasonal / limited availability' },
        },
        {
          name: 'chefRecommendation',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Chef\'s recommendation' },
        },
        {
          name: 'winePairing',
          type: 'relationship',
          relationTo: 'wine-list',
          admin: { description: 'Suggested wine pairing' },
        },
      ],
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
  ],
}
