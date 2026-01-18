'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  HelpCircle, 
  Search, 
  ChevronDown,
  Upload,
  Wand2,
  CreditCard,
  User,
  Shield,
  Zap,
  Mail,
  MessageCircle,
  Book,
  ExternalLink,
  type LucideIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  id: string;
  title: string;
  icon: LucideIcon;
  color: string;
  items: FAQItem[];
}

const FAQ_CATEGORIES: FAQCategory[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: Zap,
    color: 'text-green-400',
    items: [
      {
        question: 'What is Jewelshot?',
        answer: 'Jewelshot is an AI-powered platform that transforms your jewelry photos into stunning, professional-quality images. Upload your product photos and let AI create beautiful lifestyle shots, remove backgrounds, or enhance your images in seconds.',
      },
      {
        question: 'How do I get started?',
        answer: 'Simply sign up for a free account, upload your jewelry image, choose a preset or enter a custom prompt, and click Generate. Your AI-enhanced image will be ready in about 10-15 seconds!',
      },
      {
        question: 'What image formats are supported?',
        answer: 'We support JPG, PNG, and WebP formats. For best results, use high-resolution images (at least 1024x1024 pixels) with good lighting and a clean background.',
      },
      {
        question: 'Is there a free trial?',
        answer: 'Yes! New users receive 5 free credits to try our service. Each image generation uses 1 credit. No credit card required to get started.',
      },
    ],
  },
  {
    id: 'credits-pricing',
    title: 'Credits & Pricing',
    icon: CreditCard,
    color: 'text-purple-400',
    items: [
      {
        question: 'How do credits work?',
        answer: 'Credits are used to generate AI images. Each generation costs 1 credit. You receive credits with your subscription plan, and they refresh monthly. Unused credits carry over as long as your subscription is active.',
      },
      {
        question: 'What plans are available?',
        answer: 'We offer several plans: Basic ($29/month, 50 credits), Studio ($59/month, 150 credits), Pro ($99/month, 300 credits), and Enterprise (custom pricing). Check our Pricing page for current offers and features.',
      },
      {
        question: 'Can I buy additional credits?',
        answer: 'Yes, you can purchase credit packs separately or upgrade your plan for more monthly credits. Contact us for bulk credit purchases.',
      },
      {
        question: 'What happens when I run out of credits?',
        answer: 'You\'ll receive a notification when your credits are low. You can continue using basic features, but AI generation will require more credits. Upgrade your plan or purchase additional credits to continue.',
      },
    ],
  },
  {
    id: 'image-generation',
    title: 'Image Generation',
    icon: Wand2,
    color: 'text-pink-400',
    items: [
      {
        question: 'How long does generation take?',
        answer: 'Most images are generated in 10-15 seconds. Complex prompts or high-resolution outputs may take slightly longer. You\'ll see a progress indicator during generation.',
      },
      {
        question: 'What are presets?',
        answer: 'Presets are pre-configured styles optimized for jewelry photography. They include settings for lighting, background, model poses, and more. Choose a preset for quick, professional results.',
      },
      {
        question: 'Can I use custom prompts?',
        answer: 'Absolutely! While presets work great for most cases, you can enter custom prompts for specific requirements. Describe the scene, lighting, and style you want, and our AI will create it.',
      },
      {
        question: 'Why did my generation fail?',
        answer: 'Generations can fail due to content policy violations, server issues, or image quality problems. Try with a different image or prompt. If issues persist, contact support.',
      },
      {
        question: 'Can I regenerate an image?',
        answer: 'Yes! Each regeneration uses 1 credit. You can adjust your prompt and try again. Your original image and all generations are saved in your Gallery.',
      },
    ],
  },
  {
    id: 'account',
    title: 'Account & Billing',
    icon: User,
    color: 'text-blue-400',
    items: [
      {
        question: 'How do I upgrade my plan?',
        answer: 'Go to your Account Settings → Billing → Choose a plan. Upgrades take effect immediately, and you\'ll be charged the prorated difference.',
      },
      {
        question: 'How do I cancel my subscription?',
        answer: 'Go to Account Settings → Billing → Cancel Subscription. You\'ll keep access until the end of your billing period. We\'d love to hear why you\'re leaving!',
      },
      {
        question: 'Can I get a refund?',
        answer: 'We offer a 7-day money-back guarantee for first-time subscribers. After that, refunds are handled case-by-case. See our Refund Policy for details.',
      },
      {
        question: 'How do I change my email or password?',
        answer: 'Go to your Profile page to update personal information. For password changes, click "Reset Password" and follow the email instructions.',
      },
    ],
  },
  {
    id: 'security',
    title: 'Privacy & Security',
    icon: Shield,
    color: 'text-yellow-400',
    items: [
      {
        question: 'Is my data secure?',
        answer: 'Yes! We use industry-standard encryption (SSL/TLS) for all data transfers and encrypted storage. Your images are stored securely and only accessible to you.',
      },
      {
        question: 'Who can see my images?',
        answer: 'Only you can see your uploaded and generated images. We don\'t share your content with third parties except for AI processing, which is done securely.',
      },
      {
        question: 'Do you train AI on my images?',
        answer: 'No, we don\'t use your images to train AI models. Your content is used solely to provide the service you requested.',
      },
      {
        question: 'How do I delete my data?',
        answer: 'You can delete individual images from your Gallery. To delete all data and your account, go to Account Settings → Delete Account. This action is irreversible.',
      },
    ],
  },
];

const QUICK_LINKS = [
  { title: 'Contact Support', href: 'mailto:support@jewelshot.ai', icon: Mail },
  { title: 'Live Chat', href: '#', icon: MessageCircle, action: 'openChat' },
  { title: 'API Documentation', href: '/docs/api', icon: Book },
  { title: 'Privacy Policy', href: '/privacy', icon: Shield },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const toggleItem = (categoryId: string, index: number) => {
    const key = `${categoryId}-${index}`;
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const filteredCategories: FAQCategory[] = FAQ_CATEGORIES.map((category) => ({
    ...category,
    items: category.items.filter(
      (item) =>
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((category) => category.items.length > 0);

  const handleQuickLinkClick = (link: typeof QUICK_LINKS[0]) => {
    if (link.action === 'openChat') {
      if (typeof window !== 'undefined' && (window as any).jivo_api) {
        (window as any).jivo_api.open();
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="border-b border-white/10 bg-gradient-to-b from-purple-900/20 to-transparent">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/20 px-4 py-2 text-sm text-purple-300 mb-6">
            <HelpCircle className="h-4 w-4" />
            Help Center
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">How can we help you?</h1>
          <p className="text-white/60 mb-8 max-w-lg mx-auto">
            Find answers to common questions or contact our support team
          </p>

          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for answers..."
              className="w-full rounded-xl border border-white/10 bg-white/5 py-4 pl-12 pr-4 text-white placeholder-white/40 backdrop-blur-sm focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {QUICK_LINKS.map((link) => (
            <a
              key={link.title}
              href={link.action ? '#' : link.href}
              onClick={(e) => {
                if (link.action) {
                  e.preventDefault();
                  handleQuickLinkClick(link);
                }
              }}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 text-white hover:bg-white/10 transition-colors"
            >
              <link.icon className="h-5 w-5 text-purple-400" />
              <span className="text-sm font-medium">{link.title}</span>
              {!link.action && <ExternalLink className="h-3 w-3 text-white/40 ml-auto" />}
            </a>
          ))}
        </div>
      </div>

      {/* FAQ Categories */}
      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="space-y-8">
          {filteredCategories.map((category: FAQCategory) => {
            const Icon = category.icon;
            return (
            <div key={category.id} className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
              {/* Category Header */}
              <div className="flex items-center gap-3 p-6 border-b border-white/10 bg-white/5">
                <Icon className={`h-6 w-6 ${category.color}`} />
                <h2 className="text-xl font-semibold text-white">{category.title}</h2>
                <span className="ml-auto text-sm text-white/40">{category.items.length} articles</span>
              </div>

              {/* FAQ Items */}
              <div className="divide-y divide-white/5">
                {category.items.map((item, index) => {
                  const isExpanded = expandedItems.has(`${category.id}-${index}`);
                  return (
                    <div key={index}>
                      <button
                        onClick={() => toggleItem(category.id, index)}
                        className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
                      >
                        <span className="text-white font-medium pr-4">{item.question}</span>
                        <ChevronDown
                          className={`h-5 w-5 text-white/40 shrink-0 transition-transform ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-6 text-white/70 leading-relaxed">
                              {item.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          );
          })}
        </div>

        {/* No Results */}
        {filteredCategories.length === 0 && searchQuery && (
          <div className="text-center py-16">
            <HelpCircle className="h-12 w-12 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
            <p className="text-white/60 mb-6">
              We couldn&apos;t find any articles matching &quot;{searchQuery}&quot;
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="text-purple-400 hover:underline"
            >
              Clear search
            </button>
          </div>
        )}
      </div>

      {/* Still Need Help */}
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Still need help?</h3>
          <p className="text-white/70 mb-6 max-w-md mx-auto">
            Our support team is here to help. Reach out via email or live chat.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@jewelshot.ai"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-500 px-6 py-3 text-white font-medium hover:bg-purple-600 transition-colors"
            >
              <Mail className="h-4 w-4" />
              Email Support
            </a>
            <button
              onClick={() => {
                if (typeof window !== 'undefined' && (window as any).jivo_api) {
                  (window as any).jivo_api.open();
                }
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-6 py-3 text-white font-medium hover:bg-white/5 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              Live Chat
            </button>
          </div>
        </div>
      </div>

      {/* Back Link */}
      <div className="mx-auto max-w-5xl px-6 pb-16">
        <Link href="/" className="text-purple-400 hover:underline">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
