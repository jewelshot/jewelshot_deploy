import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy | Jewelshot',
  description: 'Learn about how Jewelshot uses cookies and similar technologies.',
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] py-20">
      <div className="mx-auto max-w-4xl px-6">
        <h1 className="mb-8 text-4xl font-bold text-white">Cookie Policy</h1>
        <p className="mb-8 text-white/60">Last updated: January 19, 2026</p>

        <div className="prose prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">1. What Are Cookies?</h2>
            <p className="text-white/70 leading-relaxed">
              Cookies are small text files stored on your device when you visit a website. 
              They help websites remember your preferences and improve your experience.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">2. Types of Cookies We Use</h2>

            <div className="mb-6 rounded-lg border border-white/10 bg-white/5 p-4">
              <h3 className="mb-2 text-lg font-medium text-white">Essential Cookies</h3>
              <p className="text-white/60 text-sm mb-2">Required for the website to function</p>
              <ul className="list-disc pl-6 text-white/70 space-y-1 text-sm">
                <li>Authentication and session management</li>
                <li>Security features (CSRF protection)</li>
                <li>Load balancing</li>
              </ul>
            </div>

            <div className="mb-6 rounded-lg border border-white/10 bg-white/5 p-4">
              <h3 className="mb-2 text-lg font-medium text-white">Functional Cookies</h3>
              <p className="text-white/60 text-sm mb-2">Enhance your experience</p>
              <ul className="list-disc pl-6 text-white/70 space-y-1 text-sm">
                <li>Language and theme preferences</li>
                <li>Recently used features</li>
                <li>Form data persistence</li>
              </ul>
            </div>

            <div className="mb-6 rounded-lg border border-white/10 bg-white/5 p-4">
              <h3 className="mb-2 text-lg font-medium text-white">Analytics Cookies</h3>
              <p className="text-white/60 text-sm mb-2">Help us improve our service</p>
              <ul className="list-disc pl-6 text-white/70 space-y-1 text-sm">
                <li>Google Analytics - Usage statistics</li>
                <li>Hotjar - User behavior analysis</li>
                <li>Plausible - Privacy-focused analytics</li>
              </ul>
            </div>

            <div className="mb-6 rounded-lg border border-white/10 bg-white/5 p-4">
              <h3 className="mb-2 text-lg font-medium text-white">Marketing Cookies</h3>
              <p className="text-white/60 text-sm mb-2">Used for advertising purposes</p>
              <ul className="list-disc pl-6 text-white/70 space-y-1 text-sm">
                <li>Meta Pixel - Ad performance tracking</li>
                <li>Conversion tracking</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">3. Third-Party Cookies</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              We use services from third parties that may set their own cookies:
            </p>
            <table className="w-full text-left text-white/70">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-2 text-white">Provider</th>
                  <th className="py-2 text-white">Purpose</th>
                  <th className="py-2 text-white">Privacy Policy</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/10">
                  <td className="py-2">Google</td>
                  <td className="py-2">Analytics, reCAPTCHA</td>
                  <td className="py-2">
                    <a href="https://policies.google.com/privacy" className="text-purple-400 hover:underline" target="_blank" rel="noopener noreferrer">
                      Link
                    </a>
                  </td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-2">Meta</td>
                  <td className="py-2">Pixel tracking</td>
                  <td className="py-2">
                    <a href="https://www.facebook.com/privacy/policy/" className="text-purple-400 hover:underline" target="_blank" rel="noopener noreferrer">
                      Link
                    </a>
                  </td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-2">Hotjar</td>
                  <td className="py-2">Heatmaps, recordings</td>
                  <td className="py-2">
                    <a href="https://www.hotjar.com/privacy/" className="text-purple-400 hover:underline" target="_blank" rel="noopener noreferrer">
                      Link
                    </a>
                  </td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-2">Supabase</td>
                  <td className="py-2">Authentication</td>
                  <td className="py-2">
                    <a href="https://supabase.com/privacy" className="text-purple-400 hover:underline" target="_blank" rel="noopener noreferrer">
                      Link
                    </a>
                  </td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-2">JivoChat</td>
                  <td className="py-2">Live chat support</td>
                  <td className="py-2">
                    <a href="https://www.jivochat.com/privacy/" className="text-purple-400 hover:underline" target="_blank" rel="noopener noreferrer">
                      Link
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">4. Managing Cookies</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              You can control cookies through:
            </p>
            <ul className="list-disc pl-6 text-white/70 space-y-2">
              <li><strong>Our cookie banner</strong> - Set preferences when you first visit</li>
              <li><strong>Browser settings</strong> - Block or delete cookies</li>
              <li><strong>Opt-out links</strong> - Use provider-specific opt-out tools</li>
            </ul>
            <p className="text-white/70 leading-relaxed mt-4">
              Note: Disabling essential cookies may affect website functionality.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">5. Cookie Retention</h2>
            <ul className="list-disc pl-6 text-white/70 space-y-2">
              <li><strong>Session cookies</strong> - Deleted when you close your browser</li>
              <li><strong>Persistent cookies</strong> - Remain for a set period (typically 1-2 years)</li>
              <li><strong>Analytics cookies</strong> - Usually 26 months</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">6. Updates to This Policy</h2>
            <p className="text-white/70 leading-relaxed">
              We may update this Cookie Policy to reflect changes in our practices or for legal reasons. 
              Check this page periodically for updates.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">7. Contact Us</h2>
            <p className="text-white/70 leading-relaxed">
              Questions about our use of cookies? Contact us at:
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
