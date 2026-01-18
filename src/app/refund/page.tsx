'use client';

import { RefreshCw, CreditCard, Clock, AlertCircle, CheckCircle2, XCircle, Mail } from 'lucide-react';
import Link from 'next/link';

export default function RefundPage() {
  const lastUpdated = 'January 19, 2026';

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="border-b border-white/10 bg-gradient-to-b from-purple-900/20 to-transparent">
        <div className="mx-auto max-w-4xl px-6 py-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <RefreshCw className="h-6 w-6 text-purple-400" />
            </div>
            <span className="text-sm font-medium text-purple-400">Legal</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Refund Policy</h1>
          <p className="text-white/60">Last updated: {lastUpdated}</p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Money Back Guarantee */}
        <section className="mb-12">
          <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-6">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle2 className="h-6 w-6 text-green-400" />
              <h2 className="text-xl font-semibold text-white">7-Day Money-Back Guarantee</h2>
            </div>
            <p className="text-white/70 leading-relaxed">
              If you&apos;re not satisfied with Jewelshot, you can request a <strong className="text-white">full refund 
              within 7 days</strong> of your first subscription purchase. No questions asked.
            </p>
          </div>
        </section>

        {/* Subscription Refunds */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
            <CreditCard className="h-6 w-6 text-purple-400" />
            Subscription Refunds
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-3">Within 7 Days</h3>
              <ul className="space-y-2 text-white/70">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400 mt-1 shrink-0" />
                  Full refund available for first-time subscribers
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400 mt-1 shrink-0" />
                  No questions asked - simply contact support
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-white mb-3">After 7 Days</h3>
              <ul className="space-y-2 text-white/70">
                <li className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-red-400 mt-1 shrink-0" />
                  Refunds are generally not provided
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-400 mt-1 shrink-0" />
                  Partial refunds may be considered case-by-case
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400 mt-1 shrink-0" />
                  Technical issues preventing use may qualify
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Credit Purchases */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
            <Clock className="h-6 w-6 text-purple-400" />
            Credit Purchases
          </h2>
          <ul className="space-y-3 text-white/70">
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              Credit purchases are <strong className="text-white">non-refundable</strong> once added to your account
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              Unused credits remain in your account and <strong className="text-white">do not expire</strong>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              Credits cannot be transferred between accounts
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              Mistaken purchases: Contact us within 24 hours
            </li>
          </ul>
        </section>

        {/* Cancellation */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6">Subscription Cancellation</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-medium text-white mb-4">How to Cancel</h3>
              <ol className="space-y-2 text-white/70 list-decimal list-inside">
                <li>Go to Account Settings</li>
                <li>Navigate to Billing</li>
                <li>Click Cancel Subscription</li>
                <li>Confirm cancellation</li>
              </ol>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-medium text-white mb-4">After Cancellation</h3>
              <ul className="space-y-2 text-white/70">
                <li>✓ Access until period ends</li>
                <li>✓ Unused credits preserved</li>
                <li>✓ Gallery images saved</li>
                <li>✓ Reverts to free plan</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Exceptional Circumstances */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-yellow-400" />
            Exceptional Circumstances
          </h2>
          <p className="text-white/70 mb-4">
            We may provide refunds outside standard policy for:
          </p>
          <ul className="space-y-2 text-white/70">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-400 mt-1 shrink-0" />
              Extended service outages (24+ hours)
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-400 mt-1 shrink-0" />
              Billing errors on our part
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-400 mt-1 shrink-0" />
              Duplicate charges
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-400 mt-1 shrink-0" />
              Unauthorized transactions
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-400 mt-1 shrink-0" />
              Severe technical issues preventing use
            </li>
          </ul>
        </section>

        {/* How to Request */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
            <Mail className="h-6 w-6 text-purple-400" />
            How to Request a Refund
          </h2>
          
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <ol className="space-y-3 text-white/70 list-decimal list-inside mb-6">
              <li>Email us at <a href="mailto:billing@jewelshot.ai" className="text-purple-400 hover:underline">billing@jewelshot.ai</a></li>
              <li>Include your account email</li>
              <li>Provide the transaction ID or date</li>
              <li>Explain the reason for your request</li>
            </ol>
            <p className="text-white/60 text-sm">
              We aim to process refund requests within 3-5 business days. 
              Approved refunds are credited to your original payment method within 5-10 business days.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="mb-12">
          <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-6 text-center">
            <h3 className="text-lg font-medium text-white mb-2">Questions about billing?</h3>
            <p className="text-white/70 mb-4">
              We&apos;re here to help! Reach out before disputing with your bank.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:billing@jewelshot.ai"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-purple-500 px-6 py-2.5 text-white font-medium hover:bg-purple-600 transition-colors"
              >
                <Mail className="h-4 w-4" />
                billing@jewelshot.ai
              </a>
              <button 
                onClick={() => {
                  if (typeof window !== 'undefined' && (window as any).jivo_api) {
                    (window as any).jivo_api.open();
                  }
                }}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 px-6 py-2.5 text-white font-medium hover:bg-white/5 transition-colors"
              >
                💬 Live Chat
              </button>
            </div>
          </div>
        </section>

        {/* Back Link */}
        <div className="border-t border-white/10 pt-8">
          <Link href="/" className="text-purple-400 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
