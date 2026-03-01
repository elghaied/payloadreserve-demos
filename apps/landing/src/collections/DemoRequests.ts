import type { CollectionConfig } from 'payload'

export const DemoRequests: CollectionConfig = {
  slug: 'demo-requests',
  admin: {
    group: 'Demo Management',
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'demoType', 'status', 'createdAt'],
  },
  timestamps: true,
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'demoType',
      type: 'select',
      required: true,
      options: [
        { label: 'Salon', value: 'salon' },
        { label: 'Hotel', value: 'hotel' },
        { label: 'Restaurant', value: 'restaurant' },
        { label: 'Events', value: 'events' },
      ],
    },
    {
      name: 'requestIp',
      type: 'text',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'submitted',
      options: [
        { label: 'Submitted', value: 'submitted' },
        { label: 'Provisioning', value: 'provisioning' },
        { label: 'Completed', value: 'completed' },
        { label: 'Failed', value: 'failed' },
        { label: 'Rejected', value: 'rejected' },
      ],
      admin: {
        components: {
          Cell: '@/components/admin/StatusBadge',
        },
      },
    },
    {
      name: 'demoInstance',
      type: 'relationship',
      relationTo: 'demo-instances',
    },
    {
      name: 'rejectionReason',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.status === 'rejected',
      },
    },
  ],
}
