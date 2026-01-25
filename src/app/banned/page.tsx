'use client';

/**
 * Banned User Page
 * 
 * Displayed when a user is banned from the platform
 */

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldX, Mail, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function BannedPage() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleContactSupport = () => {
    window.location.href = 'mailto:support@jewelshot.com?subject=Account%20Ban%20Appeal';
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md space-y-6 rounded-2xl border border-red-500/30 bg-red-950/20 p-8 backdrop-blur-xl"
      >
        {/* Icon */}
        <div className="flex justify-center">
          <div className="rounded-full bg-red-500/20 p-4">
            <ShieldX className="h-12 w-12 text-red-400" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Account Suspended</h1>
          <p className="mt-2 text-sm text-red-400">
            Your account has been suspended due to a violation of our Terms of Service.
          </p>
        </div>

        {/* Message */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
          <p className="text-sm text-white/70">
            If you believe this is a mistake, please contact our support team to appeal this decision.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleContactSupport}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 font-semibold text-white transition-all hover:bg-purple-700"
          >
            <Mail className="h-5 w-5" />
            Contact Support
          </button>
          
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-3 font-semibold text-white transition-all hover:bg-white/10"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-white/40">
          Reference ID: {typeof window !== 'undefined' ? Date.now().toString(36).toUpperCase() : 'LOADING'}
        </p>
      </motion.div>
    </div>
  );
}
