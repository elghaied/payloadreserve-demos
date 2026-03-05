import type { GlobalConfig, Field } from 'payload'

const SECRET_MASK = '••••••••'

export const SECRET_FIELDS = [
  'coolifyApiKey',
  'mongoRootUsername',
  'mongoRootPassword',
  'smtpPass',
  's3AccessKey',
  's3SecretKey',
  'stripeSecretKey',
  'stripeWebhookSecret',
  'cleanupSecret',
  'turnstileSecretKey',
]

function secretText(overrides: {
  name: string
  label: string
  required?: boolean
}): Field {
  return {
    name: overrides.name,
    type: 'text',
    label: overrides.label,
    required: overrides.required,
    admin: {
      components: {
        Field: '@/components/admin/SecretField',
      },
    },
  }
}

export const InfrastructureSettings: GlobalConfig = {
  slug: 'infrastructure-settings',
  admin: {
    group: 'Settings',
  },
  access: {
    read: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
  },
  hooks: {
    afterRead: [
      ({ doc, context }) => {
        if (context?.includeSecrets) return doc
        const masked = { ...doc }
        for (const key of SECRET_FIELDS) {
          if (masked[key]) masked[key] = SECRET_MASK
        }
        return masked
      },
    ],
    beforeChange: [
      async ({ data, originalDoc }) => {
        for (const key of SECRET_FIELDS) {
          if (data[key] === SECRET_MASK && originalDoc?.[key]) {
            data[key] = originalDoc[key]
          }
        }
        return data
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Coolify',
          fields: [
            { name: 'coolifyApiUrl', type: 'text', label: 'API URL', admin: { placeholder: 'https://coolify.example.com/api' } },
            secretText({ name: 'coolifyApiKey', label: 'API Key' }),
            { name: 'coolifyProjectUuid', type: 'text', label: 'Project UUID' },
            { name: 'coolifyServerUuid', type: 'text', label: 'Server UUID' },
            { name: 'coolifyDestinationUuid', type: 'text', label: 'Destination UUID' },
          ],
        },
        {
          label: 'Docker Images',
          fields: [
            {
              name: 'salonImage',
              type: 'group',
              label: 'Salon',
              fields: [
                { name: 'name', type: 'text', label: 'Image Name', admin: { placeholder: 'registry.example.com/org/salon' } },
                { name: 'tag', type: 'text', label: 'Tag', defaultValue: 'latest' },
              ],
            },
            {
              name: 'hotelImage',
              type: 'group',
              label: 'Hotel',
              fields: [
                { name: 'name', type: 'text', label: 'Image Name' },
                { name: 'tag', type: 'text', label: 'Tag', defaultValue: 'latest' },
              ],
            },
            {
              name: 'restaurantImage',
              type: 'group',
              label: 'Restaurant',
              fields: [
                { name: 'name', type: 'text', label: 'Image Name' },
                { name: 'tag', type: 'text', label: 'Tag', defaultValue: 'latest' },
              ],
            },
            {
              name: 'eventsImage',
              type: 'group',
              label: 'Events',
              fields: [
                { name: 'name', type: 'text', label: 'Image Name' },
                { name: 'tag', type: 'text', label: 'Tag', defaultValue: 'latest' },
              ],
            },
          ],
        },
        {
          label: 'MongoDB',
          fields: [
            { name: 'mongoHost', type: 'text', label: 'Host', admin: { description: 'Docker network hostname of the shared MongoDB instance' } },
            secretText({ name: 'mongoRootUsername', label: 'Root Username' }),
            secretText({ name: 'mongoRootPassword', label: 'Root Password' }),
          ],
        },
        {
          label: 'SMTP',
          fields: [
            { name: 'smtpHost', type: 'text', label: 'Host', admin: { placeholder: 'smtp.gmail.com' } },
            { name: 'smtpPort', type: 'number', label: 'Port', defaultValue: 587 },
            { name: 'smtpUser', type: 'text', label: 'Username' },
            secretText({ name: 'smtpPass', label: 'Password' }),
            { name: 'smtpFrom', type: 'email', label: 'From Address' },
            { name: 'smtpFromName', type: 'text', label: 'From Name', defaultValue: 'payload-reserve' },
          ],
        },
        {
          label: 'S3 Storage',
          fields: [
            { name: 's3Endpoint', type: 'text', label: 'Endpoint' },
            secretText({ name: 's3AccessKey', label: 'Access Key' }),
            secretText({ name: 's3SecretKey', label: 'Secret Key' }),
            { name: 's3Region', type: 'text', label: 'Region', defaultValue: 'us-east-1' },
            { name: 's3Bucket', type: 'text', label: 'Bucket' },
            { name: 's3Prefix', type: 'text', label: 'Key Prefix', defaultValue: 'media' },
            { name: 's3ForcePathStyle', type: 'checkbox', label: 'Force Path Style', defaultValue: true, admin: { description: 'Enable for MinIO or S3-compatible storage' } },
          ],
        },
        {
          label: 'Stripe',
          fields: [
            secretText({ name: 'stripeSecretKey', label: 'Secret Key' }),
            secretText({ name: 'stripeWebhookSecret', label: 'Webhook Secret' }),
            { name: 'stripePublishableKey', type: 'text', label: 'Publishable Key' },
          ],
        },
        {
          label: 'Demo Config',
          fields: [
            { name: 'demoBaseDomain', type: 'text', label: 'Base Domain', defaultValue: 'payloadreserve.com' },
            {
              name: 'demoProtocol',
              type: 'select',
              label: 'Protocol',
              defaultValue: 'https',
              options: [
                { label: 'HTTPS', value: 'https' },
                { label: 'HTTP', value: 'http' },
              ],
            },
            { name: 'demoTtlHours', type: 'number', label: 'Demo TTL (hours)', defaultValue: 24 },
            { name: 'maxActiveDemos', type: 'number', label: 'Max Active Demos', defaultValue: 20 },
            secretText({ name: 'cleanupSecret', label: 'Cleanup Secret' }),
            secretText({ name: 'turnstileSecretKey', label: 'Turnstile Secret Key' }),
            { name: 'turnstileSiteKey', type: 'text', label: 'Turnstile Site Key' },
          ],
        },
      ],
    },
  ],
}
