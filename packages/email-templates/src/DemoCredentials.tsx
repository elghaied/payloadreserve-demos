import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'
import type { DemoType } from '@payload-reserve-demos/types'

export interface DemoCredentialsData {
  demoUrl: string
  adminEmail: string
  adminPassword: string
  expiresAt: Date
  demoType: DemoType
}

const demoLabels: Record<DemoType, string> = {
  salon: 'Lumière Salon',
  hotel: 'Grand Hotel',
  restaurant: 'Maison Restaurant',
  events: 'Event Venue',
}

export function DemoCredentials({ demoUrl, adminEmail, adminPassword, expiresAt, demoType }: DemoCredentialsData) {
  const label = demoLabels[demoType]
  const expiresFormatted = expiresAt.toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'UTC',
  })

  return (
    <Html>
      <Head />
      <Preview>Your {label} demo is ready — expires {expiresFormatted} UTC</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>Your demo is ready</Heading>
          <Text style={text}>
            Here are your credentials for the <strong>{label}</strong> demo. The demo will be automatically
            deleted at <strong>{expiresFormatted} UTC</strong>.
          </Text>

          <Section style={credentialsBox}>
            <Text style={credentialRow}>
              <strong>URL:</strong> {demoUrl}
            </Text>
            <Text style={credentialRow}>
              <strong>Email:</strong> {adminEmail}
            </Text>
            <Text style={credentialRow}>
              <strong>Password:</strong> {adminPassword}
            </Text>
          </Section>

          <Button href={`${demoUrl}/admin`} style={button}>
            Open Admin Panel
          </Button>

          <Hr style={hr} />

          <Text style={footer}>
            This demo is pre-seeded with realistic data. It will expire at {expiresFormatted} UTC and all data will
            be permanently deleted. Powered by{' '}
            <a href="https://payload-reserve.com" style={link}>
              payload-reserve
            </a>
            .
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default DemoCredentials

const body = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '600px',
  borderRadius: '8px',
  marginTop: '40px',
  marginBottom: '40px',
}

const heading = {
  color: '#1a1a1a',
  fontSize: '28px',
  fontWeight: '700',
  lineHeight: '1.3',
  marginBottom: '16px',
}

const text = {
  color: '#444',
  fontSize: '16px',
  lineHeight: '1.6',
  marginBottom: '24px',
}

const credentialsBox = {
  backgroundColor: '#f4f4f5',
  borderRadius: '6px',
  padding: '20px',
  marginBottom: '24px',
}

const credentialRow = {
  color: '#1a1a1a',
  fontSize: '14px',
  fontFamily: 'monospace',
  margin: '6px 0',
}

const button = {
  backgroundColor: '#18181b',
  borderRadius: '6px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '14px',
  fontWeight: '600',
  padding: '12px 24px',
  textDecoration: 'none',
  marginBottom: '32px',
}

const hr = {
  borderColor: '#e5e7eb',
  margin: '24px 0',
}

const footer = {
  color: '#9ca3af',
  fontSize: '13px',
  lineHeight: '1.5',
}

const link = {
  color: '#6366f1',
}
