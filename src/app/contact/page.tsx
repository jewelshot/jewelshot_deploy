'use client';

import { useState } from 'react';
import { Sparkles, Mail, MessageSquare, Clock, MapPin, Send, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'general',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setFormState('success');
    setFormData({ name: '', email: '', subject: 'general', message: '' });
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Us',
      description: 'For general inquiries',
      value: 'hello@jewelshot.ai',
      link: 'mailto:hello@jewelshot.ai',
    },
    {
      icon: MessageSquare,
      title: 'Sales',
      description: 'For enterprise & custom plans',
      value: 'sales@jewelshot.ai',
      link: 'mailto:sales@jewelshot.ai',
    },
    {
      icon: Clock,
      title: 'Support',
      description: 'For technical assistance',
      value: 'support@jewelshot.ai',
      link: 'mailto:support@jewelshot.ai',
    },
  ];

  const subjects = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'sales', label: 'Sales & Pricing' },
    { value: 'support', label: 'Technical Support' },
    { value: 'partnership', label: 'Partnership Opportunity' },
    { value: 'press', label: 'Press & Media' },
    { value: 'feedback', label: 'Product Feedback' },
  ];

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

      <main className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          {/* Hero */}
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm text-purple-300">
              <MessageSquare className="h-4 w-4" />
              Get in Touch
            </div>
            <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
              We'd Love to Hear From You
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-white/60">
              Have a question, feedback, or want to learn more about how Jewelshot 
              can help your business? Reach out and we'll get back to you within 24 hours.
            </p>
          </div>

          {/* Contact Methods */}
          <div className="mb-16 grid gap-6 sm:grid-cols-3">
            {contactMethods.map((method) => (
              <a
                key={method.title}
                href={method.link}
                className="group rounded-2xl border border-white/10 bg-white/5 p-6 text-center transition-all hover:border-purple-500/30 hover:bg-white/10"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 transition-colors group-hover:bg-purple-500/30">
                  <method.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-1 font-semibold text-white">{method.title}</h3>
                <p className="mb-2 text-sm text-white/40">{method.description}</p>
                <p className="text-sm text-purple-400">{method.value}</p>
              </a>
            ))}
          </div>

          {/* Main Content */}
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <h2 className="mb-6 text-2xl font-bold text-white">Send Us a Message</h2>
              
              {formState === 'success' ? (
                <div className="flex flex-col items-center py-12 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 text-green-400">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-white">Message Sent!</h3>
                  <p className="mb-6 text-white/60">
                    Thank you for reaching out. We'll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setFormState('idle')}
                    className="text-purple-400 hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="mb-2 block text-sm font-medium text-white">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition-colors focus:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="mb-2 block text-sm font-medium text-white">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition-colors focus:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
                        placeholder="john@company.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="mb-2 block text-sm font-medium text-white">
                      Subject
                    </label>
                    <select
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition-colors focus:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
                    >
                      {subjects.map((subject) => (
                        <option key={subject.value} value={subject.value} className="bg-[#1a1a1a]">
                          {subject.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="mb-2 block text-sm font-medium text-white">
                      Message
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition-colors focus:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
                      placeholder="Tell us how we can help..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={formState === 'submitting'}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 py-3 font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
                  >
                    {formState === 'submitting' ? (
                      <>
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* FAQ & Info */}
            <div className="space-y-8">
              {/* Response Time */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/20 text-green-400">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Quick Response Time</h3>
                    <p className="text-sm text-white/60">We typically respond within 24 hours</p>
                  </div>
                </div>
              </div>

              {/* FAQ Preview */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="mb-4 font-semibold text-white">Common Questions</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="mb-1 text-sm font-medium text-white">How does the free trial work?</h4>
                    <p className="text-sm text-white/60">
                      Sign up and get 10 free credits to try all features. No credit card required.
                    </p>
                  </div>
                  <div>
                    <h4 className="mb-1 text-sm font-medium text-white">Can I cancel anytime?</h4>
                    <p className="text-sm text-white/60">
                      Yes, you can cancel your subscription at any time with no penalties.
                    </p>
                  </div>
                  <div>
                    <h4 className="mb-1 text-sm font-medium text-white">Do you offer custom enterprise plans?</h4>
                    <p className="text-sm text-white/60">
                      Yes! Contact our sales team for custom pricing and features.
                    </p>
                  </div>
                </div>
                <Link
                  href="/#faq"
                  className="mt-4 inline-block text-sm text-purple-400 hover:underline"
                >
                  View all FAQs →
                </Link>
              </div>

              {/* Office */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-white">Headquarters</h3>
                    <p className="text-sm text-white/60">
                      Jewelshot Inc.<br />
                      Remote-First Company<br />
                      Delaware, USA
                    </p>
                  </div>
                </div>
              </div>

              {/* Social */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="mb-4 font-semibold text-white">Follow Us</h3>
                <div className="flex gap-4">
                  <a
                    href="https://twitter.com/jewelshot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white/60 transition-all hover:bg-white/10 hover:text-white"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                  <a
                    href="https://linkedin.com/company/jewelshot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white/60 transition-all hover:bg-white/10 hover:text-white"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </a>
                  <a
                    href="https://instagram.com/jewelshot.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white/60 transition-all hover:bg-white/10 hover:text-white"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#0a0a0a] px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-white/40">© 2025 Jewelshot. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-white/40">
            <Link href="/about" className="hover:text-white/60">About</Link>
            <Link href="/privacy" className="hover:text-white/60">Privacy</Link>
            <Link href="/terms" className="hover:text-white/60">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

