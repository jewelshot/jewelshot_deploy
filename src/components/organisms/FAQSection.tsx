/**
 * FAQSection - Frequently Asked Questions
 * Accordion-style FAQ with smooth animations
 */

'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: 'What is Jewelshot?',
    answer: 'Jewelshot is an AI-powered photo editing platform specifically designed for jewelry photography. It helps jewelers, brands, and photographers create stunning, professional product images in seconds using advanced AI technology.',
  },
  {
    question: 'How does the AI editing work?',
    answer: 'Our AI analyzes your jewelry images and applies professional-grade enhancements including background removal, color correction, lighting adjustments, and scene generation. Simply upload your photo, choose a preset or customize settings, and let the AI do the magic.',
  },
  {
    question: 'What file formats are supported?',
    answer: 'We support all major image formats including JPG, PNG, WEBP, and HEIC. For 3D viewing, we support STL files with 3DM support coming soon. Maximum file size is 20MB for images.',
  },
  {
    question: 'Can I use Jewelshot for commercial purposes?',
    answer: 'Absolutely! All images you create with Jewelshot are yours to use commercially. This includes e-commerce listings, social media, print catalogs, and advertising materials.',
  },
  {
    question: 'How many images can I process?',
    answer: 'It depends on your plan. Free users get 10 credits per month, Pro users get 500 credits, and Enterprise users have unlimited processing. Each image edit uses 1 credit.',
  },
  {
    question: 'Is there a free trial?',
    answer: 'Yes! You can sign up for free and get 10 credits to try out all our features. No credit card required. Upgrade anytime to unlock more credits and advanced features.',
  },
  {
    question: 'What makes Jewelshot different from other editors?',
    answer: 'Jewelshot is built specifically for jewelry photography with AI models trained on millions of jewelry images. Our presets and tools understand the unique challenges of capturing sparkle, reflections, and fine details that generic editors miss.',
  },
  {
    question: 'Do you offer batch processing?',
    answer: 'Yes! Pro and Enterprise users can batch process multiple images at once. Upload up to 50 images, apply the same preset or settings, and download all enhanced images in one go.',
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative overflow-hidden px-6 py-24" id="faq">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-4 py-2">
            <HelpCircle className="h-4 w-4 text-amber-400" />
            <span className="text-sm font-medium text-amber-300">FAQ</span>
          </div>
          <h2 className="mb-4 text-4xl font-bold text-white sm:text-5xl">
            Frequently Asked{' '}
            <span className="bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-white/60">
            Everything you need to know about Jewelshot
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                openIndex === index
                  ? 'border-amber-500/30 bg-amber-500/5'
                  : 'border-white/10 bg-white/[0.02] hover:border-white/20'
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between p-6 text-left"
              >
                <span className="pr-4 text-lg font-medium text-white">{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 flex-shrink-0 text-amber-400 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-6 text-white/70 leading-relaxed">{faq.answer}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 rounded-2xl border border-white/10 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 p-8 text-center">
          <h3 className="mb-2 text-xl font-semibold text-white">Still have questions?</h3>
          <p className="mb-6 text-white/60">
            Our team is here to help. Reach out anytime.
          </p>
          <a
            href="mailto:support@jewelshot.ai"
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 font-medium text-white transition-all hover:bg-white/20"
          >
            Contact Support
          </a>
        </div>
      </div>
    </section>
  );
}

