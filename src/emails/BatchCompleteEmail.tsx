/**
 * Batch Complete Email Template
 * 
 * Sent when batch processing is complete
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

interface BatchCompleteEmailProps {
  userName?: string;
  batchName: string;
  totalImages: number;
  successfulImages: number;
  failedImages: number;
  batchId: string;
}

export default function BatchCompleteEmail({
  userName = 'there',
  batchName,
  totalImages,
  successfulImages,
  failedImages,
  batchId,
}: BatchCompleteEmailProps) {
  const successRate = ((successfulImages / totalImages) * 100).toFixed(0);

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          
          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>✅ Your Batch is Ready!</Heading>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Text style={paragraph}>Hi {userName},</Text>
            
            <Text style={paragraph}>
              Great news! Your batch <strong>"{batchName}"</strong> has finished processing.
            </Text>

            {/* Stats Box */}
            <Section style={statsBox}>
              <Text style={statsTitle}>Processing Summary</Text>
              
              <Section style={statsGrid}>
                <Section style={statItem}>
                  <Text style={statNumber}>{totalImages}</Text>
                  <Text style={statLabel}>Total Images</Text>
                </Section>
                
                <Section style={statItem}>
                  <Text style={statNumberSuccess}>{successfulImages}</Text>
                  <Text style={statLabel}>Successful</Text>
                </Section>
                
                {failedImages > 0 && (
                  <Section style={statItem}>
                    <Text style={statNumberError}>{failedImages}</Text>
                    <Text style={statLabel}>Failed</Text>
                  </Section>
                )}
                
                <Section style={statItem}>
                  <Text style={statNumber}>{successRate}%</Text>
                  <Text style={statLabel}>Success Rate</Text>
                </Section>
              </Section>
            </Section>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Button 
                style={button} 
                href={`https://www.jewelshot.ai/gallery?batch=${batchId}`}
              >
                View Your Images →
              </Button>
            </Section>

            {failedImages > 0 && (
              <>
                <Hr style={hr} />
                <Text style={warningText}>
                  ⚠️ {failedImages} image{failedImages > 1 ? 's' : ''} failed to process. 
                  Credits for failed images have been refunded.
                </Text>
              </>
            )}

            <Hr style={hr} />

            {/* Next Steps */}
            <Heading style={h2}>What's Next?</Heading>
            
            <Text style={listItem}>
              • <strong>Download</strong> your images from the gallery
            </Text>
            <Text style={listItem}>
              • <strong>Share</strong> them on your store or social media
            </Text>
            <Text style={listItem}>
              • <strong>Process more</strong> batches to save time
            </Text>

            <Hr style={hr} />

            <Text style={footer}>
              Questions? Reply to this email - we're here to help!
            </Text>

            <Text style={footer}>
              Best regards,<br />
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
  backgroundColor: '#10b981',
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

const statsBox = {
  backgroundColor: '#262626',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
};

const statsTitle = {
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 16px',
  textAlign: 'center' as const,
};

const statsGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
  gap: '16px',
  textAlign: 'center' as const,
};

const statItem = {
  textAlign: 'center' as const,
};

const statNumber = {
  color: '#8b5cf6',
  fontSize: '32px',
  fontWeight: '700',
  margin: '0 0 4px',
};

const statNumberSuccess = {
  color: '#10b981',
  fontSize: '32px',
  fontWeight: '700',
  margin: '0 0 4px',
};

const statNumberError = {
  color: '#ef4444',
  fontSize: '32px',
  fontWeight: '700',
  margin: '0 0 4px',
};

const statLabel = {
  color: '#999999',
  fontSize: '12px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  margin: '0',
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
  backgroundColor: '#10b981',
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

const warningText = {
  color: '#f59e0b',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0',
  padding: '12px',
  backgroundColor: '#78350f20',
  borderRadius: '6px',
  borderLeft: '3px solid #f59e0b',
};

const footer = {
  color: '#999999',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '8px 0',
};

