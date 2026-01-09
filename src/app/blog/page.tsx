'use client';

import { Sparkles, Calendar, Clock, ArrowRight, Tag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function BlogPage() {
  const featuredPost = {
    slug: 'ai-revolution-jewelry-photography',
    title: 'The AI Revolution in Jewelry Photography: What You Need to Know',
    excerpt: 'Discover how artificial intelligence is transforming the way jewelers create product photos, reducing costs by up to 90% while improving quality.',
    image: '/blog/featured-ai-jewelry.jpg',
    category: 'Industry Insights',
    author: 'Jewelshot Team',
    date: 'January 5, 2025',
    readTime: '8 min read',
  };

  const blogPosts = [
    {
      slug: '5-tips-product-photography',
      title: '5 Tips for Better Jewelry Product Photos',
      excerpt: 'Learn the fundamentals of jewelry photography that will make your AI-generated images even more stunning.',
      image: '/blog/tips-photography.jpg',
      category: 'Tips & Tricks',
      date: 'January 3, 2025',
      readTime: '5 min read',
    },
    {
      slug: 'on-model-vs-product-only',
      title: 'On-Model vs Product-Only: Which Works Better?',
      excerpt: 'We analyzed conversion rates across thousands of jewelry listings to find which style drives more sales.',
      image: '/blog/on-model-comparison.jpg',
      category: 'Research',
      date: 'December 28, 2024',
      readTime: '6 min read',
    },
    {
      slug: 'lighting-guide-jewelry',
      title: 'The Complete Guide to Jewelry Lighting',
      excerpt: 'Understanding light is key to great jewelry photos. Here\'s everything you need to know about lighting setups.',
      image: '/blog/lighting-guide.jpg',
      category: 'Tutorials',
      date: 'December 20, 2024',
      readTime: '10 min read',
    },
    {
      slug: 'customer-success-story-gemora',
      title: 'How Gemora Increased Sales by 340% with AI Photos',
      excerpt: 'A small jewelry brand shares their journey from struggling with product photography to dominating online sales.',
      image: '/blog/case-study-gemora.jpg',
      category: 'Case Study',
      date: 'December 15, 2024',
      readTime: '7 min read',
    },
    {
      slug: 'ecommerce-jewelry-trends-2025',
      title: 'E-commerce Jewelry Trends to Watch in 2025',
      excerpt: 'From AI-powered personalization to 3D product views, here are the trends shaping the future of online jewelry sales.',
      image: '/blog/trends-2025.jpg',
      category: 'Industry Insights',
      date: 'December 10, 2024',
      readTime: '8 min read',
    },
    {
      slug: 'batch-processing-guide',
      title: 'Mastering Batch Processing: Edit 100+ Images at Once',
      excerpt: 'Save hours of work by learning how to use Jewelshot\'s batch processing feature for large catalogs.',
      image: '/blog/batch-guide.jpg',
      category: 'Tutorials',
      date: 'December 5, 2024',
      readTime: '6 min read',
    },
  ];

  const categories = [
    { name: 'All Posts', count: 7 },
    { name: 'Tutorials', count: 3 },
    { name: 'Industry Insights', count: 2 },
    { name: 'Tips & Tricks', count: 1 },
    { name: 'Case Study', count: 1 },
    { name: 'Research', count: 1 },
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

      <main className="mx-auto max-w-7xl px-6 py-16">
        {/* Hero */}
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            Jewelshot Blog
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-white/60">
            Insights, tutorials, and industry news to help you create stunning 
            jewelry photography and grow your business.
          </p>
        </div>

        {/* Featured Post */}
        <section className="mb-16">
          <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition-all hover:border-purple-500/30">
            <div className="grid gap-8 p-8 lg:grid-cols-2 lg:p-0">
              <div className="relative aspect-video overflow-hidden lg:aspect-auto lg:h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20"></div>
                <div className="flex h-full items-center justify-center text-6xl text-white/20">
                  <Sparkles className="h-24 w-24" />
                </div>
              </div>
              <div className="flex flex-col justify-center lg:p-12">
                <div className="mb-4 flex items-center gap-4">
                  <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-medium text-purple-300">
                    {featuredPost.category}
                  </span>
                  <span className="text-xs text-white/40">Featured</span>
                </div>
                <h2 className="mb-4 text-2xl font-bold text-white transition-colors group-hover:text-purple-300 lg:text-3xl">
                  {featuredPost.title}
                </h2>
                <p className="mb-6 text-white/60">{featuredPost.excerpt}</p>
                <div className="mb-6 flex items-center gap-4 text-sm text-white/40">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {featuredPost.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {featuredPost.readTime}
                  </span>
                </div>
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="inline-flex items-center gap-2 font-medium text-purple-400 transition-colors hover:text-purple-300"
                >
                  Read Article
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="grid gap-12 lg:grid-cols-4">
          {/* Posts Grid */}
          <div className="lg:col-span-3">
            <h2 className="mb-8 text-2xl font-bold text-white">Latest Articles</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {blogPosts.map((post) => (
                <article
                  key={post.slug}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all hover:border-purple-500/30 hover:bg-white/10"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10"></div>
                    <div className="flex h-full items-center justify-center text-white/10">
                      <Sparkles className="h-16 w-16" />
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="mb-3 flex items-center gap-3">
                      <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/60">
                        {post.category}
                      </span>
                    </div>
                    <h3 className="mb-2 line-clamp-2 font-semibold text-white transition-colors group-hover:text-purple-300">
                      {post.title}
                    </h3>
                    <p className="mb-4 line-clamp-2 text-sm text-white/60">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-white/40">
                      <span>{post.date}</span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Load More */}
            <div className="mt-12 text-center">
              <button className="rounded-xl border border-white/10 bg-white/5 px-8 py-3 font-medium text-white transition-all hover:bg-white/10">
                Load More Articles
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Categories */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="mb-4 font-semibold text-white">Categories</h3>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category.name}>
                    <button className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white">
                      <span>{category.name}</span>
                      <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">
                        {category.count}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div className="rounded-2xl border border-purple-500/30 bg-purple-500/10 p-6">
              <h3 className="mb-2 font-semibold text-white">Stay Updated</h3>
              <p className="mb-4 text-sm text-white/60">
                Get the latest articles and product updates delivered to your inbox.
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder-white/40 focus:border-purple-500/50 focus:outline-none"
                />
                <button className="w-full rounded-lg bg-purple-500 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-600">
                  Subscribe
                </button>
              </div>
            </div>

            {/* Popular Tags */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="mb-4 font-semibold text-white">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {['AI Photography', 'Jewelry', 'E-commerce', 'Tutorial', 'Tips', 'Marketing', 'Case Study', 'Trends'].map((tag) => (
                  <button
                    key={tag}
                    className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-6 text-center">
              <h3 className="mb-2 font-semibold text-white">Try Jewelshot Free</h3>
              <p className="mb-4 text-sm text-white/60">
                Transform your jewelry photos with AI. No credit card required.
              </p>
              <Link
                href="/auth/signup"
                className="inline-block rounded-lg bg-white px-6 py-2 text-sm font-medium text-[#0a0a0a] transition-colors hover:bg-white/90"
              >
                Get Started
              </Link>
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

