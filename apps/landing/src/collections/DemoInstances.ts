import type { CollectionConfig } from 'payload'
import { cleanupDemoInstance } from '@/hooks/cleanupDemoInstance'

export const DemoInstances: CollectionConfig = {
  slug: 'demo-instances',
  admin: {
    group: 'Demo Management',
    useAsTitle: 'demoId',
    defaultColumns: ['demoId', 'type', 'status', 'adminEmail', 'expiresAt', 'createdAt'],
  },
  timestamps: true,
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  hooks: {
    afterDelete: [cleanupDemoInstance],
  },
  fields: [
    {
      name: 'demoId',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { readOnly: true },
    },
    {
      name: 'type',
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
      name: 'subdomain',
      type: 'text',
      required: true,
    },
    {
      name: 'dbName',
      type: 'text',
      required: true,
    },
    {
      name: 's3Prefix',
      type: 'text',
      required: true,
    },
    {
      name: 'adminEmail',
      type: 'email',
      required: true,
    },
    {
      name: 'adminPasswordHash',
      type: 'text',
      required: true,
      admin: { hidden: true },
    },
    {
      name: 'statusTokenHash',
      type: 'text',
      admin: { hidden: true },
    },
    {
      name: 'coolifyServiceId',
      type: 'text',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'provisioning',
      options: [
        { label: 'Provisioning', value: 'provisioning' },
        { label: 'Ready', value: 'ready' },
        { label: 'Ready (Email Failed)', value: 'ready_email_failed' },
        { label: 'Expired', value: 'expired' },
        { label: 'Failed', value: 'failed' },
      ],
      admin: {
        components: {
          Cell: '@/components/admin/StatusBadge',
        },
      },
    },
    {
      name: 'expiresAt',
      type: 'date',
      required: true,
    },
    {
      name: 'requestIp',
      type: 'text',
    },
  ],
}
