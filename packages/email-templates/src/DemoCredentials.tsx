import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
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
  salon: 'Lumiere Salon',
  hotel: 'Grand Hotel',
  restaurant: 'Maison Restaurant',
  events: 'Event Venue',
}

const demoDescriptions: Record<DemoType, string> = {
  salon: 'A hair salon booking system with services, stylists, and appointment scheduling.',
  hotel: 'A hotel room reservation system with room types, availability, and guest management.',
  restaurant: 'A restaurant table booking system with seating, time slots, and party sizes.',
  events: 'An event venue booking system with spaces, packages, and event scheduling.',
}

export function DemoCredentials({ demoUrl, adminEmail, adminPassword, expiresAt, demoType }: DemoCredentialsData) {
  const label = demoLabels[demoType]
  const description = demoDescriptions[demoType]
  const adminUrl = `${demoUrl}/admin`
  const expiresFormatted = expiresAt.toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'UTC',
  })

  return (
    <Html>
      <Head>
        <style>{`
          @media only screen and (max-width: 600px) {
            .button-row td {
              display: block !important;
              width: 100% !important;
              padding-bottom: 12px !important;
            }
          }
        `}</style>
      </Head>
      <Preview>Your {label} demo is ready — log in and explore the admin panel</Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Header band */}
          <Section style={headerBand}>
            <Text style={headerLogo}>payload-reserve</Text>
            <Text style={headerSubtitle}>Private Demo Environment</Text>
          </Section>

          {/* Main content */}
          <Section style={mainContent}>
            <Heading style={heading}>Your {label} demo is live</Heading>
            <Text style={intro}>
              {description} Your private instance is pre-loaded with realistic sample data so you
              can explore every feature right away.
            </Text>

            {/* Two CTA buttons */}
            <Section style={buttonRow}>
              <Row>
                <Column className="button-row" style={buttonCol}>
                  <Button href={demoUrl} style={primaryButton}>
                    Visit Website
                  </Button>
                </Column>
                <Column className="button-row" style={buttonCol}>
                  <Button href={adminUrl} style={secondaryButton}>
                    Open Admin Panel
                  </Button>
                </Column>
              </Row>
            </Section>

            {/* Credentials card */}
            <Section style={credentialsCard}>
              <Text style={credentialsLabel}>Your Login Credentials</Text>

              <Section style={credentialField}>
                <Text style={fieldLabel}>Admin Panel URL</Text>
                <Text style={fieldValue}>{adminUrl}</Text>
              </Section>

              <Section style={credentialField}>
                <Text style={fieldLabel}>Email</Text>
                <Text style={fieldValue}>{adminEmail}</Text>
              </Section>

              <Section style={credentialField}>
                <Text style={fieldLabel}>Password</Text>
                <Text style={fieldValueMono}>{adminPassword}</Text>
              </Section>

              <Section style={credentialField}>
                <Text style={fieldLabel}>Website URL</Text>
                <Text style={fieldValue}>{demoUrl}</Text>
              </Section>
            </Section>

            {/* Expiry warning */}
            <Section style={expiryBanner}>
              <Text style={expiryText}>
                This demo expires on <strong>{expiresFormatted} UTC</strong> and all data will be
                permanently deleted after that.
              </Text>
            </Section>

            <Hr style={divider} />

            {/* Getting started guide */}
            <Heading as="h2" style={sectionHeading}>Getting Started</Heading>
            <Text style={guideText}>
              New to Payload CMS? Here is a quick guide to help you navigate your demo:
            </Text>

            <Section style={stepRow}>
              <Row>
                <Column style={stepNumberCol}>
                  <Text style={stepNumber}>1</Text>
                </Column>
                <Column style={stepContentCol}>
                  <Text style={stepTitle}>Explore the website</Text>
                  <Text style={stepDesc}>
                    Visit <a href={demoUrl} style={link}>{demoUrl}</a> to see the public-facing
                    booking experience — this is what your customers would see.
                  </Text>
                </Column>
              </Row>
            </Section>

            <Section style={stepRow}>
              <Row>
                <Column style={stepNumberCol}>
                  <Text style={stepNumber}>2</Text>
                </Column>
                <Column style={stepContentCol}>
                  <Text style={stepTitle}>Log in to the admin panel</Text>
                  <Text style={stepDesc}>
                    Go to <a href={adminUrl} style={link}>{adminUrl}</a> and sign in with the
                    credentials above. This is the Payload CMS dashboard where you manage
                    everything.
                  </Text>
                </Column>
              </Row>
            </Section>

            <Section style={stepRow}>
              <Row>
                <Column style={stepNumberCol}>
                  <Text style={stepNumber}>3</Text>
                </Column>
                <Column style={stepContentCol}>
                  <Text style={stepTitle}>Browse the collections</Text>
                  <Text style={stepDesc}>
                    In the admin sidebar, you will find collections like Reservations, Services,
                    Customers, and Schedules. Click any item to see how the plugin structures data.
                  </Text>
                </Column>
              </Row>
            </Section>

            <Section style={stepRow}>
              <Row>
                <Column style={stepNumberCol}>
                  <Text style={stepNumber}>4</Text>
                </Column>
                <Column style={stepContentCol}>
                  <Text style={stepTitle}>Try making a booking</Text>
                  <Text style={stepDesc}>
                    Use the website to create a reservation, then switch to the admin panel to see
                    it appear in real time. Edit statuses, check availability, and explore the full
                    workflow.
                  </Text>
                </Column>
              </Row>
            </Section>

            <Hr style={divider} />

            {/* Footer */}
            <Text style={footer}>
              This is an automated message from{' '}
              <a href="https://payloadreserve.com" style={link}>payload-reserve</a>
              , the open-source reservation plugin for Payload CMS.
              If you did not request this demo, you can safely ignore this email.
            </Text>

            <Text style={footerLinks}>
              <a href="https://payloadreserve.com" style={footerLink}>Website</a>
              {'  ·  '}
              <a href="https://payloadreserve.com/docs" style={footerLink}>Documentation</a>
              {'  ·  '}
              <a href="https://github.com/elghaied/payload-reserve" style={footerLink}>GitHub</a>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default DemoCredentials

/* ─── Styles ───────────────────────────────────────────────────────────────── */

const brand = {
  violet: '#5B21B6',
  violetLight: '#7C3AED',
  violetPale: '#F5F3FF',
  amber: '#F59E0B',
  amberDark: '#D97706',
  warmWhite: '#FAFAF8',
  warmBlack: '#1C1917',
  stone600: '#57534E',
  stone400: '#A8A29E',
  stone200: '#E7E5E4',
}

const body: React.CSSProperties = {
  backgroundColor: '#F0EDE8',
  fontFamily: "'Outfit', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  margin: 0,
  padding: 0,
}

const container: React.CSSProperties = {
  maxWidth: '600px',
  margin: '0 auto',
  paddingTop: '40px',
  paddingBottom: '40px',
}

const headerBand: React.CSSProperties = {
  backgroundColor: brand.violet,
  borderRadius: '12px 12px 0 0',
  padding: '32px 40px 28px',
  textAlign: 'center' as const,
}

const headerLogo: React.CSSProperties = {
  color: '#FFFFFF',
  fontSize: '22px',
  fontWeight: 700,
  fontFamily: "Georgia, 'Times New Roman', serif",
  letterSpacing: '-0.02em',
  margin: '0 0 4px',
}

const headerSubtitle: React.CSSProperties = {
  color: 'rgba(255,255,255,0.7)',
  fontSize: '13px',
  fontWeight: 400,
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  margin: 0,
}

const mainContent: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '0 0 12px 12px',
  padding: '40px 40px 32px',
}

const heading: React.CSSProperties = {
  color: brand.warmBlack,
  fontSize: '26px',
  fontWeight: 700,
  fontFamily: "Georgia, 'Times New Roman', serif",
  lineHeight: '1.25',
  margin: '0 0 16px',
}

const intro: React.CSSProperties = {
  color: brand.stone600,
  fontSize: '15px',
  lineHeight: '1.65',
  margin: '0 0 28px',
}

const buttonRow: React.CSSProperties = {
  marginBottom: '28px',
}

const buttonCol: React.CSSProperties = {
  width: '50%',
  paddingRight: '6px',
  paddingLeft: '6px',
  verticalAlign: 'top' as const,
}

const primaryButton: React.CSSProperties = {
  backgroundColor: brand.violet,
  borderRadius: '8px',
  color: '#FFFFFF',
  display: 'block',
  fontSize: '14px',
  fontWeight: 600,
  padding: '14px 0',
  textDecoration: 'none',
  textAlign: 'center' as const,
  width: '100%',
}

const secondaryButton: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  border: `2px solid ${brand.violet}`,
  borderRadius: '8px',
  color: brand.violet,
  display: 'block',
  fontSize: '14px',
  fontWeight: 600,
  padding: '12px 0',
  textDecoration: 'none',
  textAlign: 'center' as const,
  width: '100%',
}

const credentialsCard: React.CSSProperties = {
  backgroundColor: brand.violetPale,
  border: `1px solid ${brand.stone200}`,
  borderRadius: '10px',
  padding: '24px 24px 8px',
  marginBottom: '24px',
}

const credentialsLabel: React.CSSProperties = {
  color: brand.violet,
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'uppercase' as const,
  margin: '0 0 16px',
}

const credentialField: React.CSSProperties = {
  marginBottom: '16px',
}

const fieldLabel: React.CSSProperties = {
  color: brand.stone400,
  fontSize: '11px',
  fontWeight: 600,
  letterSpacing: '0.04em',
  textTransform: 'uppercase' as const,
  margin: '0 0 2px',
}

const fieldValue: React.CSSProperties = {
  color: brand.warmBlack,
  fontSize: '15px',
  fontWeight: 500,
  margin: 0,
  wordBreak: 'break-all' as const,
}

const fieldValueMono: React.CSSProperties = {
  ...fieldValue,
  fontFamily: "'DM Mono', 'Fira Code', 'Courier New', monospace",
  fontSize: '14px',
  backgroundColor: '#FFFFFF',
  border: `1px solid ${brand.stone200}`,
  borderRadius: '4px',
  padding: '6px 10px',
  display: 'inline-block' as const,
}

const expiryBanner: React.CSSProperties = {
  backgroundColor: '#FFFBEB',
  border: '1px solid #FDE68A',
  borderRadius: '8px',
  padding: '14px 20px',
  marginBottom: '28px',
}

const expiryText: React.CSSProperties = {
  color: brand.amberDark,
  fontSize: '13px',
  lineHeight: '1.5',
  margin: 0,
}

const divider: React.CSSProperties = {
  borderColor: brand.stone200,
  borderWidth: '1px 0 0 0',
  margin: '0 0 28px',
}

const sectionHeading: React.CSSProperties = {
  color: brand.warmBlack,
  fontSize: '18px',
  fontWeight: 700,
  fontFamily: "Georgia, 'Times New Roman', serif",
  margin: '0 0 8px',
}

const guideText: React.CSSProperties = {
  color: brand.stone600,
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0 0 24px',
}

const stepRow: React.CSSProperties = {
  marginBottom: '20px',
}

const stepNumberCol: React.CSSProperties = {
  width: '36px',
  verticalAlign: 'top' as const,
}

const stepNumber: React.CSSProperties = {
  backgroundColor: brand.violet,
  color: '#FFFFFF',
  fontSize: '13px',
  fontWeight: 700,
  width: '26px',
  height: '26px',
  lineHeight: '26px',
  borderRadius: '50%',
  textAlign: 'center' as const,
  margin: 0,
}

const stepContentCol: React.CSSProperties = {
  verticalAlign: 'top' as const,
  paddingLeft: '4px',
}

const stepTitle: React.CSSProperties = {
  color: brand.warmBlack,
  fontSize: '14px',
  fontWeight: 600,
  margin: '0 0 4px',
}

const stepDesc: React.CSSProperties = {
  color: brand.stone600,
  fontSize: '13px',
  lineHeight: '1.55',
  margin: 0,
}

const link: React.CSSProperties = {
  color: brand.violet,
  textDecoration: 'underline',
}

const footer: React.CSSProperties = {
  color: brand.stone400,
  fontSize: '12px',
  lineHeight: '1.6',
  margin: '0 0 12px',
}

const footerLinks: React.CSSProperties = {
  color: brand.stone400,
  fontSize: '12px',
  textAlign: 'center' as const,
  margin: 0,
}

const footerLink: React.CSSProperties = {
  color: brand.stone400,
  textDecoration: 'underline',
}
