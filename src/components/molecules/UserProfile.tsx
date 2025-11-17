/**
 * UserProfile Component (Molecule)
 *
 * Dynamic user profile display at the bottom of sidebar.
 * Fetches user data from Supabase and shows logout dropdown.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, ChevronDown } from 'lucide-react';
import Avatar from '@/components/atoms/Avatar';
import OnlineIndicator from '@/components/atoms/OnlineIndicator';
import UserInfo from '@/components/atoms/UserInfo';
import { useCreditStore } from '@/store/creditStore';
import { aiRateLimiter } from '@/lib/rate-limiter';
import { createScopedLogger } from '@/lib/logger';

const logger = createScopedLogger('UserProfile');
import { createClient } from '@/lib/supabase/client';

export function UserProfile() {
  const router = useRouter();
  const { credits, loading: creditsLoading, fetchCredits } = useCreditStore();
  const [user, setUser] = useState<{
    name: string;
    email: string;
    avatar: string;
  } | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [aiRequests, setAiRequests] = useState(() =>
    aiRateLimiter.getRemainingRequests()
  );

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (authUser) {
        setUser({
          name: authUser.user_metadata?.full_name || 'User',
          email: authUser.email || '',
          avatar:
            authUser.user_metadata?.avatar_url ||
            (authUser.user_metadata?.full_name || 'U').charAt(0).toUpperCase(),
        });
      }
    };

    fetchUser();
    fetchCredits(); // 🎯 Fetch credits on mount

    // Update AI requests count every 2 seconds
    const interval = setInterval(() => {
      setAiRequests(aiRateLimiter.getRemainingRequests());
    }, 2000);

    // Listen for rate limit changes
    const handleStorageChange = () => {
      setAiRequests(aiRateLimiter.getRemainingRequests());
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [fetchCredits]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setIsDropdownOpen(false);

    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/');
    } catch (error) {
      logger.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!user) {
    return (
      <div className="mt-auto flex items-center gap-3 rounded-2xl border border-[rgba(139,92,246,0.2)] bg-[rgba(10,10,10,0.6)] p-3.5 backdrop-blur-md">
        <div className="h-10 w-10 animate-pulse rounded-full bg-white/10" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-24 animate-pulse rounded bg-white/10" />
          <div className="h-2 w-32 animate-pulse rounded bg-white/10" />
          <div className="mt-1.5 h-2 w-16 animate-pulse rounded bg-white/10" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative mt-auto">
      {/* User Profile Button */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex w-full items-center gap-3 rounded-2xl border border-[rgba(139,92,246,0.2)] bg-[rgba(10,10,10,0.6)] p-3.5 backdrop-blur-md transition-all duration-300 hover:border-purple-500/40 hover:bg-[rgba(10,10,10,0.8)]"
        disabled={isLoggingOut}
      >
        {/* Avatar with Online Indicator */}
        <div className="relative">
          <Avatar content={user.avatar} size="md" />
          <OnlineIndicator online={true} />
        </div>

        {/* User Info & Credits */}
        <div className="flex-1">
          <UserInfo name={user.name} status={user.email} />

          {/* 💎 Credits & AI Requests Display - Integrated Below User Info */}
          <div className="mt-1.5 flex items-center gap-3">
            {/* Credits */}
            <div className="flex items-center gap-1.5">
              <div className="text-[10px] font-medium text-white/40">
                Credits:
              </div>
              {creditsLoading ? (
                <div className="h-3 w-8 animate-pulse rounded bg-white/10" />
              ) : (
                <div
                  className={`text-xs font-bold ${
                    credits === 0
                      ? 'text-red-400'
                      : credits <= 3
                        ? 'text-yellow-400'
                        : 'bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'
                  }`}
                >
                  {credits}
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="h-3 w-px bg-white/10" />

            {/* AI Requests */}
            <div className="flex items-center gap-1.5">
              <div className="text-[10px] font-medium text-white/40">AI:</div>
              <div
                className={`text-xs font-bold tabular-nums ${
                  aiRequests === 0
                    ? 'text-red-400'
                    : aiRequests <= 2
                      ? 'text-yellow-400'
                      : 'text-green-400'
                }`}
              >
                {aiRequests}/5
              </div>
            </div>
          </div>
        </div>

        {/* Dropdown Icon */}
        <ChevronDown
          className={`ml-auto h-4 w-4 text-white/60 transition-transform duration-300 ${
            isDropdownOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsDropdownOpen(false)}
          />

          {/* Dropdown */}
          <div
            className="absolute bottom-full left-0 right-0 z-50 mb-2 overflow-hidden rounded-xl border border-white/10 bg-[rgba(10,10,10,0.95)] shadow-2xl backdrop-blur-xl"
            style={{
              animation: 'slideInFromBottom 200ms cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm text-white/80 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
            >
              <LogOut className="h-4 w-4" />
              <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
            </button>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes slideInFromBottom {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default UserProfile;
