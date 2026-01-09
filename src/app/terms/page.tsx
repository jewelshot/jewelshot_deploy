'use client';

import { Sparkles, FileText, Scale, AlertTriangle, CreditCard, Ban, RefreshCw, Gavel } from 'lucide-react';
import Link from 'next/link';

export default function TermsPage() {
  const lastUpdated = 'January 9, 2025';

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Jewelshot</span>
          </Link>
          <Link href="/" className="text-sm text-white/60 transition-colors hover:text-white">
            Back to Home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-16">
        {/* Title */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm text-purple-300">
            <FileText className="h-4 w-4" />
            Legal Agreement
          </div>
          <h1 className="mb-4 text-4xl font-bold text-white">Terms of Service</h1>
          <p className="text-white/60">Last updated: {lastUpdated}</p>
        </div>

        {/* Introduction */}
        <div className="mb-12 rounded-2xl border border-white/10 bg-white/5 p-8">
          <p className="leading-relaxed text-white/70">
            Welcome to Jewelshot. These Terms of Service ("Terms") govern your access to and use of 
            the Jewelshot platform, including our website, applications, and AI-powered jewelry 
            photography services. By creating an account or using our services, you agree to be 
            bound by these Terms.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-12">
          {/* Section 1: Account */}
          <section>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400">
                <Scale className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold text-white">1. Account Terms</h2>
            </div>
            <div className="space-y-4 pl-[52px] text-white/60">
              <p>By creating an account on Jewelshot, you agree that:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-500"></span>
                  <span>You are at least 16 years old and have the legal capacity to enter into these Terms.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-500"></span>
                  <span>You will provide accurate and complete information during registration.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-500"></span>
                  <span>You are responsible for maintaining the security of your account credentials.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-500"></span>
                  <span>You will notify us immediately of any unauthorized access to your account.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-500"></span>
                  <span>One person or entity may not maintain more than one account.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 2: Acceptable Use */}
          <section>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold text-white">2. Acceptable Use</h2>
            </div>
            <div className="space-y-4 pl-[52px] text-white/60">
              <p>You agree to use Jewelshot only for lawful purposes. You may NOT:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-500"></span>
                  <span>Upload images that you don't own or don't have rights to use.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-500"></span>
                  <span>Generate content that is illegal, harmful, or violates others' rights.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-500"></span>
                  <span>Attempt to reverse engineer, decompile, or extract our AI models.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-500"></span>
                  <span>Use automated systems to access our service without permission.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-500"></span>
                  <span>Resell or redistribute our services without authorization.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-500"></span>
                  <span>Generate content depicting real individuals without their consent.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3: Intellectual Property */}
          <section>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400">
                <FileText className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold text-white">3. Intellectual Property</h2>
            </div>
            <div className="space-y-4 pl-[52px]">
              <div>
                <h3 className="mb-2 font-semibold text-white">Your Content</h3>
                <p className="text-white/60">
                  You retain ownership of the images you upload to Jewelshot. By uploading content, 
                  you grant us a limited license to process your images through our AI systems 
                  solely to provide you with our services.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-white">Generated Content</h3>
                <p className="text-white/60">
                  Subject to your compliance with these Terms and your subscription plan, you own 
                  the AI-generated images created through Jewelshot. You may use these images for 
                  commercial purposes, including marketing, e-commerce, and advertising.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-white">Our Platform</h3>
                <p className="text-white/60">
                  Jewelshot's platform, including our AI models, algorithms, user interface, and 
                  all related intellectual property, remains our exclusive property. These Terms 
                  do not grant you any rights to our underlying technology.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Payment */}
          <section>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400">
                <CreditCard className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold text-white">4. Payment Terms</h2>
            </div>
            <div className="space-y-4 pl-[52px] text-white/60">
              <p><strong className="text-white">Subscription Plans:</strong> We offer various subscription plans with different features and credit allocations. Plan details and pricing are available on our pricing page.</p>
              <p><strong className="text-white">Billing:</strong> Subscriptions are billed in advance on a monthly or annual basis. Your subscription will automatically renew unless cancelled.</p>
              <p><strong className="text-white">Credits:</strong> Credits included in your plan expire at the end of each billing period and do not roll over.</p>
              <p><strong className="text-white">Refunds:</strong> We offer a 14-day money-back guarantee for first-time subscribers. After this period, fees are non-refundable except as required by law.</p>
              <p><strong className="text-white">Price Changes:</strong> We may change our prices with 30 days' notice. Price changes will not affect your current billing period.</p>
            </div>
          </section>

          {/* Section 5: Cancellation */}
          <section>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400">
                <RefreshCw className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold text-white">5. Cancellation & Termination</h2>
            </div>
            <div className="space-y-4 pl-[52px]">
              <div>
                <h3 className="mb-2 font-semibold text-white">By You</h3>
                <p className="text-white/60">
                  You may cancel your subscription at any time through your account settings. 
                  Cancellation takes effect at the end of your current billing period. You 
                  retain access to paid features until then.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-white">By Us</h3>
                <p className="text-white/60">
                  We may suspend or terminate your account if you violate these Terms, engage in 
                  fraudulent activity, or fail to pay fees. We may also discontinue the service 
                  with 90 days' notice.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-white">Effect of Termination</h3>
                <p className="text-white/60">
                  Upon termination, your right to use the service ends immediately. We will 
                  delete your data in accordance with our Privacy Policy. You should export 
                  any content you wish to keep before cancellation.
                </p>
              </div>
            </div>
          </section>

          {/* Section 6: Prohibited Content */}
          <section>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/20 text-red-400">
                <Ban className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold text-white">6. Prohibited Content</h2>
            </div>
            <div className="space-y-4 pl-[52px]">
              <p className="text-white/60">The following content is strictly prohibited on Jewelshot:</p>
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
                <ul className="space-y-2 text-white/60">
                  <li>• Content depicting minors in any inappropriate context</li>
                  <li>• Explicit adult or pornographic content</li>
                  <li>• Content promoting violence, terrorism, or hate</li>
                  <li>• Counterfeit or fraudulent product representations</li>
                  <li>• Content infringing on trademarks or copyrights</li>
                  <li>• Malware, viruses, or malicious code</li>
                  <li>• Content designed to deceive or defraud consumers</li>
                </ul>
              </div>
              <p className="text-white/60">
                We reserve the right to remove any content that violates these guidelines and 
                to terminate accounts that repeatedly violate these rules.
              </p>
            </div>
          </section>

          {/* Section 7: Disclaimers */}
          <section>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold text-white">7. Disclaimers & Limitations</h2>
            </div>
            <div className="space-y-4 pl-[52px] text-white/60">
              <p>
                <strong className="text-white">AS-IS Service:</strong> Jewelshot is provided "as is" 
                without warranties of any kind. We do not guarantee that the service will be 
                uninterrupted, error-free, or meet your specific requirements.
              </p>
              <p>
                <strong className="text-white">AI Limitations:</strong> Our AI may occasionally 
                produce unexpected or imperfect results. We continuously work to improve quality 
                but cannot guarantee specific outcomes.
              </p>
              <p>
                <strong className="text-white">Liability Limit:</strong> Our total liability for 
                any claims arising from these Terms or your use of Jewelshot shall not exceed the 
                amount you paid us in the 12 months preceding the claim.
              </p>
              <p>
                <strong className="text-white">Indirect Damages:</strong> We are not liable for any 
                indirect, incidental, special, consequential, or punitive damages, including loss 
                of profits, data, or business opportunities.
              </p>
            </div>
          </section>

          {/* Section 8: Governing Law */}
          <section>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400">
                <Gavel className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold text-white">8. Governing Law & Disputes</h2>
            </div>
            <div className="space-y-4 pl-[52px] text-white/60">
              <p>
                These Terms shall be governed by and construed in accordance with the laws of 
                Delaware, United States, without regard to its conflict of law provisions.
              </p>
              <p>
                Any disputes arising from these Terms or your use of Jewelshot shall first be 
                attempted to be resolved through good-faith negotiation. If negotiation fails, 
                disputes shall be resolved through binding arbitration in accordance with the 
                rules of the American Arbitration Association.
              </p>
              <p>
                You agree to resolve disputes individually and waive any right to class actions 
                or class arbitration.
              </p>
            </div>
          </section>

          {/* Section 9: Changes */}
          <section>
            <h2 className="mb-6 text-2xl font-bold text-white">9. Changes to Terms</h2>
            <div className="space-y-4 text-white/60">
              <p>
                We may modify these Terms at any time. Material changes will be communicated via 
                email or through the platform with at least 30 days' notice. Your continued use 
                of Jewelshot after changes take effect constitutes acceptance of the modified Terms.
              </p>
            </div>
          </section>
        </div>

        {/* Contact */}
        <section className="mt-12 rounded-2xl border border-purple-500/30 bg-purple-500/10 p-8">
          <h2 className="mb-4 text-xl font-bold text-white">Questions About These Terms?</h2>
          <p className="mb-4 text-white/60">
            If you have any questions about these Terms of Service, please contact us:
          </p>
          <ul className="space-y-2 text-white/70">
            <li>Email: <a href="mailto:legal@jewelshot.ai" className="text-purple-400 hover:underline">legal@jewelshot.ai</a></li>
            <li>Address: Jewelshot Inc., Legal Department</li>
          </ul>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#0a0a0a] px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-white/40">© 2025 Jewelshot. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-white/40">
            <Link href="/privacy" className="hover:text-white/60">Privacy</Link>
            <Link href="/security" className="hover:text-white/60">Security</Link>
            <Link href="/gdpr" className="hover:text-white/60">GDPR</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

