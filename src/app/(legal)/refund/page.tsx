import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund Policy | Jewelshot',
  description: 'Learn about our refund and cancellation policies for Jewelshot subscriptions.',
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] py-20">
      <div className="mx-auto max-w-4xl px-6">
        <h1 className="mb-8 text-4xl font-bold text-white">Refund Policy</h1>
        <p className="mb-8 text-white/60">Last updated: January 19, 2026</p>

        <div className="prose prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">1. Subscription Refunds</h2>
            
            <div className="mb-6 rounded-lg border border-green-500/30 bg-green-500/10 p-4">
              <h3 className="mb-2 text-lg font-medium text-green-400">✅ 7-Day Money-Back Guarantee</h3>
              <p className="text-white/70">
                If you&apos;re not satisfied with Jewelshot, you can request a full refund within 
                7 days of your first subscription purchase. No questions asked.
              </p>
            </div>

            <h3 className="mb-3 text-xl font-medium text-white/90">After 7 Days</h3>
            <ul className="list-disc pl-6 text-white/70 space-y-2">
              <li>Refunds are generally not provided after the 7-day period</li>
              <li>Partial refunds may be considered on a case-by-case basis</li>
              <li>Technical issues that prevent service use may qualify for refunds</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">2. Credit Purchases</h2>
            <ul className="list-disc pl-6 text-white/70 space-y-2">
              <li>Credit purchases are non-refundable once credits are added to your account</li>
              <li>Unused credits remain in your account and do not expire</li>
              <li>Credits cannot be transferred between accounts</li>
              <li>If credits were purchased by mistake, contact us within 24 hours</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">3. Subscription Cancellation</h2>
            
            <h3 className="mb-3 text-xl font-medium text-white/90">How to Cancel</h3>
            <ol className="list-decimal pl-6 text-white/70 space-y-2 mb-4">
              <li>Go to your <strong>Account Settings</strong></li>
              <li>Navigate to <strong>Billing</strong> section</li>
              <li>Click <strong>Cancel Subscription</strong></li>
              <li>Confirm your cancellation</li>
            </ol>

            <h3 className="mb-3 text-xl font-medium text-white/90">What Happens After Cancellation</h3>
            <ul className="list-disc pl-6 text-white/70 space-y-2">
              <li>Your subscription remains active until the end of the billing period</li>
              <li>You retain access to all features until the period ends</li>
              <li>Unused credits remain available</li>
              <li>Your account reverts to the free plan after the period ends</li>
              <li>Your images and gallery are preserved</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">4. Plan Changes</h2>
            
            <h3 className="mb-3 text-xl font-medium text-white/90">Upgrades</h3>
            <ul className="list-disc pl-6 text-white/70 space-y-2 mb-4">
              <li>Upgrades take effect immediately</li>
              <li>You&apos;ll be charged the prorated difference</li>
              <li>New credits are added instantly</li>
            </ul>

            <h3 className="mb-3 text-xl font-medium text-white/90">Downgrades</h3>
            <ul className="list-disc pl-6 text-white/70 space-y-2">
              <li>Downgrades take effect at the next billing cycle</li>
              <li>No refund for the remaining period</li>
              <li>Excess credits are retained</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">5. Exceptional Circumstances</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              We may provide refunds outside the standard policy for:
            </p>
            <ul className="list-disc pl-6 text-white/70 space-y-2">
              <li>Extended service outages (24+ hours)</li>
              <li>Billing errors on our part</li>
              <li>Duplicate charges</li>
              <li>Unauthorized transactions</li>
              <li>Severe technical issues preventing use</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">6. How to Request a Refund</h2>
            <ol className="list-decimal pl-6 text-white/70 space-y-2">
              <li>Email us at <a href="mailto:billing@jewelshot.ai" className="text-purple-400 hover:underline">billing@jewelshot.ai</a></li>
              <li>Include your account email</li>
              <li>Provide the transaction ID or date</li>
              <li>Explain the reason for your request</li>
            </ol>
            <p className="text-white/70 leading-relaxed mt-4">
              We aim to process refund requests within 3-5 business days. Approved refunds 
              are credited to your original payment method within 5-10 business days.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">7. Chargebacks</h2>
            <p className="text-white/70 leading-relaxed">
              If you dispute a charge with your bank before contacting us, we may suspend 
              your account pending resolution. Please reach out to us first - we&apos;re here to help!
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">8. Contact Us</h2>
            <p className="text-white/70 leading-relaxed">
              For billing questions or refund requests:
              <br /><br />
              📧 Email: <a href="mailto:billing@jewelshot.ai" className="text-purple-400 hover:underline">billing@jewelshot.ai</a>
              <br />
              💬 Live Chat: Available on our website
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
