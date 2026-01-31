'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { PrimaryButton } from '@/components/atoms/PrimaryButton';

/**
 * Navbar - Professional navigation bar
 * Sticky header with glassmorphism effect
 */
export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Testimonials', href: '#testimonials' },
  ];

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="Jewelshot" 
              className="h-10 w-10 transition-transform group-hover:scale-110"
            />
            <span className="text-2xl font-bold text-white">Jewelshot®</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-white/60 transition-colors hover:text-white"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-4 md:flex">
            <a
              href="/auth/login"
              className="text-sm font-medium text-white/60 transition-colors hover:text-white"
            >
              Sign In
            </a>
            <PrimaryButton href="/auth/signup" size="sm">
              Start Free
            </PrimaryButton>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white backdrop-blur-xl transition-colors hover:bg-white/10 md:hidden"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="border-t border-white/10 py-4 md:hidden">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm font-medium text-white/60 transition-colors hover:text-white"
                >
                  {link.name}
                </a>
              ))}
              <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4">
                <a
                  href="/auth/login"
                  className="text-center text-sm font-medium text-white/60 transition-colors hover:text-white"
                >
                  Sign In
                </a>
                <PrimaryButton href="/auth/signup" size="sm" className="w-full">
                  Start Free
                </PrimaryButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
