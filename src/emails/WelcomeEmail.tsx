/**
 * Welcome Email Template
 * 
 * Sent when user signs up
 */

import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Button,
  Heading,
  Hr,
} from '@react-email/components';

interface WelcomeEmailProps {
  userName?: string;
  userEmail: string;
  creditsReceived?: number;
}

export default function WelcomeEmail({
  userName = 'there',
  userEmail,
  creditsReceived = 5,
}: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          
          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>✨ Welcome to Jewelshot!</Heading>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Text style={paragraph}>Hi {userName},</Text>
            
            <Text style={paragraph}>
              Welcome to <strong>Jewelshot</strong> - your AI-powered jewelry photography studio! 
              We're excited to have you on board.
            </Text>

            <Text style={paragraph}>
              🎁 You've received <strong>{creditsReceived} free credits</strong> to get started. 
              Use them to transform your jewelry photos into stunning professional shots!
            </Text>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Button style={button} href="https://www.jewelshot.ai/studio">
                Start Creating →
              </Button>
            </Section>

            <Hr style={hr} />

            {/* Quick Start Guide */}
            <Heading style={h2}>🚀 Quick Start Guide</Heading>
            
            <Text style={listItem}>
              <strong>1. Upload Your Photo</strong> - Add your jewelry image
            </Text>
            <Text style={listItem}>
              <strong>2. Choose a Preset</strong> - Select from professional styles
            </Text>
            <Text style={listItem}>
              <strong>3. Generate</strong> - Watch AI create stunning results
            </Text>
            <Text style={listItem}>
              <strong>4. Download</strong> - Get your high-quality images
            </Text>

            <Hr style={hr} />

            {/* Features */}
            <Text style={paragraph}>
              <strong>What you can do:</strong>
            </Text>
            <Text style={listItem}>• AI Background Removal</Text>
            <Text style={listItem}>• Professional Presets</Text>
            <Text style={listItem}>• Batch Processing</Text>
            <Text style={listItem}>• HD Upscaling</Text>

            <Hr style={hr} />

            {/* Support */}
            <Text style={footer}>
              Need help? Reply to this email or visit our{' '}
              <Link href="https://www.jewelshot.ai/help" style={link}>
                Help Center
              </Link>
            </Text>

            <Text style={footer}>
              Happy creating!<br />
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
  backgroundColor: '#8b5cf6',
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
  fontSize: '24px',
  fontWeight: '600',
  margin: '24px 0 16px',
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

const listItem = {
  color: '#d4d4d4',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0 0 8px',
  paddingLeft: '8px',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#8b5cf6',
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

const link = {
  color: '#8b5cf6',
  textDecoration: 'underline',
};

const footer = {
  color: '#999999',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '8px 0',
};

