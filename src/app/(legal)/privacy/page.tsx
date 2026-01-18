import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Jewelshot',
  description: 'Learn how Jewelshot collects, uses, and protects your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] py-20">
      <div className="mx-auto max-w-4xl px-6">
        <h1 className="mb-8 text-4xl font-bold text-white">Privacy Policy</h1>
        <p className="mb-8 text-white/60">Last updated: January 19, 2026</p>

        <div className="prose prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">1. Introduction</h2>
            <p className="text-white/70 leading-relaxed">
              Jewelshot (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
              when you use our AI-powered jewelry photography platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">2. Information We Collect</h2>
            
            <h3 className="mb-3 text-xl font-medium text-white/90">2.1 Personal Information</h3>
            <ul className="mb-4 list-disc pl-6 text-white/70 space-y-2">
              <li>Name and email address</li>
              <li>Phone number (for verification)</li>
              <li>Company name and business type</li>
              <li>Billing information and payment details</li>
              <li>Profile information you provide</li>
            </ul>

            <h3 className="mb-3 text-xl font-medium text-white/90">2.2 Usage Data</h3>
            <ul className="mb-4 list-disc pl-6 text-white/70 space-y-2">
              <li>Images you upload for processing</li>
              <li>Generated images and prompts</li>
              <li>Feature usage and preferences</li>
              <li>Device information and IP address</li>
              <li>Browser type and operating system</li>
            </ul>

            <h3 className="mb-3 text-xl font-medium text-white/90">2.3 Cookies and Tracking</h3>
            <p className="text-white/70 leading-relaxed">
              We use cookies and similar technologies to enhance your experience. 
              See our <a href="/cookies" className="text-purple-400 hover:underline">Cookie Policy</a> for details.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 text-white/70 space-y-2">
              <li>To provide and maintain our service</li>
              <li>To process your images using AI technology</li>
              <li>To manage your account and subscriptions</li>
              <li>To communicate with you about updates and promotions</li>
              <li>To improve our services and develop new features</li>
              <li>To prevent fraud and ensure security</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">4. Data Storage and Security</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              Your data is stored securely using industry-standard encryption. We use:
            </p>
            <ul className="list-disc pl-6 text-white/70 space-y-2">
              <li>SSL/TLS encryption for data in transit</li>
              <li>Encrypted storage for data at rest</li>
              <li>Secure cloud infrastructure (Supabase, Vercel)</li>
              <li>Regular security audits and updates</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">5. Data Sharing</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              We do not sell your personal information. We may share data with:
            </p>
            <ul className="list-disc pl-6 text-white/70 space-y-2">
              <li>Service providers (payment processors, cloud hosting)</li>
              <li>AI processing partners (for image generation)</li>
              <li>Analytics providers (in aggregated form)</li>
              <li>Legal authorities when required by law</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">6. Your Rights</h2>
            <p className="text-white/70 leading-relaxed mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 text-white/70 space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Delete your account and data</li>
              <li>Export your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">7. Data Retention</h2>
            <p className="text-white/70 leading-relaxed">
              We retain your data for as long as your account is active or as needed to provide services. 
              Upon account deletion, we remove your personal data within 30 days, except where retention 
              is required for legal purposes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">8. International Transfers</h2>
            <p className="text-white/70 leading-relaxed">
              Your data may be transferred to and processed in countries other than your own. 
              We ensure appropriate safeguards are in place for such transfers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">9. Children&apos;s Privacy</h2>
            <p className="text-white/70 leading-relaxed">
              Our service is not intended for users under 18 years of age. 
              We do not knowingly collect data from children.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">10. Changes to This Policy</h2>
            <p className="text-white/70 leading-relaxed">
              We may update this policy periodically. We will notify you of significant changes 
              via email or through our platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">11. Contact Us</h2>
            <p className="text-white/70 leading-relaxed">
              For privacy-related questions, contact us at:
              <br />
              <a href="mailto:privacy@jewelshot.ai" className="text-purple-400 hover:underline">
                privacy@jewelshot.ai
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
