import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Jewelshot',
  description: 'Terms and conditions for using the Jewelshot AI photography platform.',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] py-20">
      <div className="mx-auto max-w-4xl px-6">
        <h1 className="mb-8 text-4xl font-bold text-white">Terms of Service</h1>
        <p className="mb-8 text-white/60">Last updated: January 19, 2026</p>

        <div className="prose prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">1. Acceptance of Terms</h2>
            <p className="text-white/70 leading-relaxed">
              By accessing or using Jewelshot (&quot;Service&quot;), you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">2. Description of Service</h2>
            <p className="text-white/70 leading-relaxed">
              Jewelshot is an AI-powered platform that helps jewelry businesses create professional 
              product photography. Our services include image editing, background removal, 
              AI-generated lifestyle shots, and batch processing.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">3. Account Registration</h2>
            <ul className="list-disc pl-6 text-white/70 space-y-2">
              <li>You must provide accurate and complete information</li>
              <li>You are responsible for maintaining account security</li>
              <li>One account per person/business is allowed</li>
              <li>You must be at least 18 years old to use the Service</li>
              <li>Sharing account credentials is prohibited</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">4. Credits and Payments</h2>
            
            <h3 className="mb-3 text-xl font-medium text-white/90">4.1 Credit System</h3>
            <ul className="mb-4 list-disc pl-6 text-white/70 space-y-2">
              <li>Credits are required to use AI features</li>
              <li>Different operations consume different amounts of credits</li>
              <li>Credits do not expire while your subscription is active</li>
              <li>Unused credits are non-refundable</li>
            </ul>

            <h3 className="mb-3 text-xl font-medium text-white/90">4.2 Subscriptions</h3>
            <ul className="mb-4 list-disc pl-6 text-white/70 space-y-2">
              <li>Subscriptions are billed monthly or annually</li>
              <li>Auto-renewal occurs unless cancelled</li>
              <li>Price changes will be notified 30 days in advance</li>
              <li>Downgrades take effect at the next billing cycle</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">5. Acceptable Use</h2>
            <p className="text-white/70 leading-relaxed mb-4">You agree NOT to:</p>
            <ul className="list-disc pl-6 text-white/70 space-y-2">
              <li>Upload illegal, harmful, or offensive content</li>
              <li>Infringe on intellectual property rights</li>
              <li>Attempt to bypass security measures or rate limits</li>
              <li>Use the Service for automated scraping or bulk operations outside intended use</li>
              <li>Share or resell access to the Service</li>
              <li>Create multiple accounts to abuse free credits</li>
              <li>Use VPNs or proxies to circumvent geographic restrictions</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">6. Intellectual Property</h2>
            
            <h3 className="mb-3 text-xl font-medium text-white/90">6.1 Your Content</h3>
            <p className="text-white/70 leading-relaxed mb-4">
              You retain ownership of images you upload. By uploading, you grant us a license 
              to process and store them for service provision.
            </p>

            <h3 className="mb-3 text-xl font-medium text-white/90">6.2 Generated Content</h3>
            <p className="text-white/70 leading-relaxed mb-4">
              You own the rights to AI-generated images created from your uploads, 
              subject to our fair use policies.
            </p>

            <h3 className="mb-3 text-xl font-medium text-white/90">6.3 Our Property</h3>
            <p className="text-white/70 leading-relaxed">
              Jewelshot branding, software, and technology remain our exclusive property.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">7. Service Availability</h2>
            <ul className="list-disc pl-6 text-white/70 space-y-2">
              <li>We strive for 99.9% uptime but do not guarantee it</li>
              <li>Scheduled maintenance will be announced in advance</li>
              <li>We may modify or discontinue features with notice</li>
              <li>AI results may vary and are not guaranteed</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">8. Limitation of Liability</h2>
            <p className="text-white/70 leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, JEWELSHOT SHALL NOT BE LIABLE FOR ANY 
              INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING 
              LOSS OF PROFITS, DATA, OR BUSINESS OPPORTUNITIES.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">9. Indemnification</h2>
            <p className="text-white/70 leading-relaxed">
              You agree to indemnify and hold harmless Jewelshot from any claims arising from 
              your use of the Service, your content, or your violation of these Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">10. Termination</h2>
            <ul className="list-disc pl-6 text-white/70 space-y-2">
              <li>You may cancel your account at any time</li>
              <li>We may suspend or terminate accounts that violate these Terms</li>
              <li>Upon termination, your data will be deleted per our Privacy Policy</li>
              <li>Refunds for termination follow our Refund Policy</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">11. Dispute Resolution</h2>
            <p className="text-white/70 leading-relaxed">
              Any disputes shall be resolved through binding arbitration in accordance with 
              applicable laws. You waive any right to participate in class action lawsuits.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">12. Changes to Terms</h2>
            <p className="text-white/70 leading-relaxed">
              We may update these Terms at any time. Continued use after changes constitutes 
              acceptance of the new Terms. Material changes will be notified via email.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">13. Contact</h2>
            <p className="text-white/70 leading-relaxed">
              Questions about these Terms? Contact us at:
              <br />
              <a href="mailto:legal@jewelshot.ai" className="text-purple-400 hover:underline">
                legal@jewelshot.ai
              </a>
            </p>
          </section>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8">
          <a href="/" className="text-purple-400 hover:underline">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
