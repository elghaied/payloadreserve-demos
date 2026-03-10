import type { CollectionConfig } from 'payload'

export const MenuCategories: CollectionConfig = {
  slug: 'menu-categories',
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
          ],
        },
      ],
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
