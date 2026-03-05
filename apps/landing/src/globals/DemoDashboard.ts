import type { GlobalConfig } from 'payload'

export const DemoDashboard: GlobalConfig = {
  slug: 'demo-dashboard',
  label: 'Demo Dashboard',
  admin: {
    group: 'Demo Management',
    components: {
      views: {
        edit: {
          default: {
            Component: '@/components/admin/DemoDashboard',
          },
        },
      },
    },
  },
  access: {
    read: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
  },
  fields: [],
}
