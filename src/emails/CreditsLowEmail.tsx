/**
 * Credits Low Email Template
 * 
 * Sent when user's credits are running low (< 5)
 */

import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Heading,
  Hr,
} from '@react-email/components';

interface CreditsLowEmailProps {
  userName?: string;
  creditsRemaining: number;
}

export default function CreditsLowEmail({
  userName = 'there',
  creditsRemaining,
}: CreditsLowEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          
          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>⚠️ Credits Running Low</Heading>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Text style={paragraph}>Hi {userName},</Text>
            
            <Text style={paragraph}>
              Your Jewelshot credits are running low!
            </Text>

            {/* Alert Box */}
            <Section style={alertBox}>
              <Text style={alertTitle}>Current Balance</Text>
              <Text style={creditNumber}>{creditsRemaining}</Text>
              <Text style={alertSubtext}>
                {creditsRemaining === 0 
                  ? 'credits left - Top up to continue creating!' 
                  : 'credits remaining'}
              </Text>
            </Section>

            <Text style={paragraph}>
              {creditsRemaining === 0 
                ? "You've used all your credits. Don't let your creative flow stop - add more credits to keep transforming your jewelry photos!"
                : "You're running out of credits. Top up now to avoid interruption in your work!"
              }
            </Text>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Button style={button} href="https://www.jewelshot.ai/profile?tab=credits">
                Add Credits →
              </Button>
            </Section>

            <Hr style={hr} />

            {/* Credit Packages */}
            <Heading style={h2}>💎 Credit Packages</Heading>
            
            <Section style={packagesGrid}>
              <Section style={packageItem}>
                <Text style={packageCredits}>10</Text>
                <Text style={packageLabel}>Starter</Text>
              </Section>
              
              <Section style={packageItem}>
                <Text style={packageCredits}>50</Text>
                <Text style={packageLabel}>Popular</Text>
              </Section>
              
              <Section style={packageItem}>
                <Text style={packageCredits}>100</Text>
                <Text style={packageLabel}>Pro</Text>
              </Section>
              
              <Section style={packageItem}>
                <Text style={packageCredits}>500</Text>
                <Text style={packageLabel}>Business</Text>
              </Section>
            </Section>

            <Hr style={hr} />

            <Text style={footer}>
              Need help choosing? Reply to this email!
            </Text>

            <Text style={footer}>
              The Jewelshot Team 💎
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#0a0a0a',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '600px',
};

const header = {
  backgroundColor: '#f59e0b',
  borderRadius: '8px 8px 0 0',
  padding: '32px 24px',
  textAlign: 'center' as const,
};

const h1 = {
  color: '#ffffff',
  fontSize: '32px',
  fontWeight: '700',
  margin: '0',
  padding: '0',
};

const h2 = {
  color: '#ffffff',
  fontSize: '20px',
  fontWeight: '600',
  margin: '24px 0 16px',
  textAlign: 'center' as const,
};

const content = {
  backgroundColor: '#1a1a1a',
  borderRadius: '0 0 8px 8px',
  padding: '32px 24px',
};

const paragraph = {
  color: '#e5e5e5',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '0 0 16px',
};

const alertBox = {
  backgroundColor: '#78350f20',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
  textAlign: 'center' as const,
  border: '2px solid #f59e0b',
};

const alertTitle = {
  color: '#f59e0b',
  fontSize: '14px',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
  margin: '0 0 8px',
  fontWeight: '600',
};

const creditNumber = {
  color: '#ffffff',
  fontSize: '48px',
  fontWeight: '700',
  margin: '8px 0',
};

const alertSubtext = {
  color: '#d4d4d4',
  fontSize: '14px',
  margin: '8px 0 0',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#f59e0b',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 32px',
};

const hr = {
  borderColor: '#333333',
  margin: '24px 0',
};

const packagesGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
  gap: '12px',
  margin: '16px 0',
};

const packageItem = {
  backgroundColor: '#262626',
  borderRadius: '8px',
  padding: '16px',
  textAlign: 'center' as const,
  border: '1px solid #333333',
};

const packageCredits = {
  color: '#8b5cf6',
  fontSize: '24px',
  fontWeight: '700',
  margin: '0 0 4px',
};

const packageLabel = {
  color: '#999999',
  fontSize: '12px',
  margin: '0',
};

const footer = {
  color: '#999999',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '8px 0',
};

