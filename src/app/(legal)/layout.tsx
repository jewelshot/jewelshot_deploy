import { ReactNode } from 'react';

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Simple header for legal pages */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <a href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-white">💎 Jewelshot</span>
          </a>
          <nav className="hidden md:flex items-center gap-6">
            <a href="/privacy" className="text-sm text-white/60 hover:text-white transition-colors">
              Privacy
            </a>
            <a href="/terms" className="text-sm text-white/60 hover:text-white transition-colors">
              Terms
            </a>
            <a href="/cookies" className="text-sm text-white/60 hover:text-white transition-colors">
              Cookies
            </a>
            <a href="/refund" className="text-sm text-white/60 hover:text-white transition-colors">
              Refund
            </a>
          </nav>
          <a 
            href="/"
            className="rounded-lg bg-purple-500 px-4 py-2 text-sm font-medium text-white hover:bg-purple-600 transition-colors"
          >
            Back to App
          </a>
        </div>
      </header>
      
      {/* Add padding for fixed header */}
      <div className="pt-16">
        {children}
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#0a0a0a] py-8">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} Jewelshot. All rights reserved.
          </p>
          <div className="mt-4 flex justify-center gap-6">
            <a href="/privacy" className="text-sm text-white/40 hover:text-white/60">Privacy</a>
            <a href="/terms" className="text-sm text-white/40 hover:text-white/60">Terms</a>
            <a href="/cookies" className="text-sm text-white/40 hover:text-white/60">Cookies</a>
            <a href="/refund" className="text-sm text-white/40 hover:text-white/60">Refund</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
