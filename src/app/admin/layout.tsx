/**
 * Admin Layout - SECURITY ENFORCED
 * 
 * This layout protects ALL admin pages with:
 * - Session-based authentication
 * - Role-based access control (admin/superadmin only)
 * - Redirect to login if not authenticated
 * - Access denied page if not admin
 * 
 * IMPORTANT: Never expose admin functionality to non-admin users!
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Shield, Lock, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

type AuthState = 'loading' | 'unauthenticated' | 'unauthorized' | 'authorized';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  
  const [authState, setAuthState] = useState<AuthState>('loading');
  const [userEmail, setUserEmail] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('');

  useEffect(() => {
    checkAdminAccess();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setAuthState('unauthenticated');
        router.push('/auth/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [pathname]);

  const checkAdminAccess = async () => {
    try {
      setAuthState('loading');

      // Check session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        setAuthState('unauthenticated');
        return;
      }

      setUserEmail(session.user.email || '');

      // Check user role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        setAuthState('unauthorized');
        return;
      }

      const role = (profile as { role?: string } | null)?.role;
      setUserRole(role || 'user');

      // Only allow admin and superadmin
      if (role === 'admin' || role === 'superadmin') {
        setAuthState('authorized');
      } else {
        setAuthState('unauthorized');
      }
    } catch (error) {
      console.error('Admin auth check failed:', error);
      setAuthState('unauthorized');
    }
  };

  // ============================================
  // LOADING STATE
  // ============================================
  if (authState === 'loading') {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <div className="mb-4 flex items-center justify-center">
            <Shield className="h-12 w-12 text-purple-500 animate-pulse" />
          </div>
          <div className="flex items-center gap-2 text-white/60">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Verifying admin access...</span>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // NOT AUTHENTICATED
  // ============================================
  if (authState === 'unauthenticated') {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#0a0a0a]">
        <div className="mx-4 max-w-md text-center">
          <div className="mb-6 flex items-center justify-center">
            <div className="rounded-full bg-red-500/20 p-4">
              <Lock className="h-8 w-8 text-red-400" />
            </div>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-white">Authentication Required</h1>
          <p className="mb-6 text-white/60">
            You must be logged in to access the admin panel.
          </p>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 rounded-lg bg-purple-500 px-6 py-3 font-medium text-white transition-colors hover:bg-purple-600"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  // ============================================
  // NOT AUTHORIZED (Not Admin)
  // ============================================
  if (authState === 'unauthorized') {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#0a0a0a]">
        <div className="mx-4 max-w-md text-center">
          <div className="mb-6 flex items-center justify-center">
            <div className="rounded-full bg-red-500/20 p-4">
              <Shield className="h-8 w-8 text-red-400" />
            </div>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-white">Access Denied</h1>
          <p className="mb-2 text-white/60">
            You don't have permission to access the admin panel.
          </p>
          <p className="mb-6 text-sm text-white/40">
            Current role: <span className="text-white/60">{userRole || 'user'}</span>
            <br />
            Required: <span className="text-purple-400">admin</span> or <span className="text-purple-400">superadmin</span>
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-6 py-3 font-medium text-white transition-colors hover:bg-white/5"
            >
              <ArrowLeft className="h-4 w-4" />
              Go to Dashboard
            </Link>
          </div>
          <p className="mt-6 text-xs text-white/30">
            If you believe this is an error, contact your system administrator.
          </p>
        </div>
      </div>
    );
  }

  // ============================================
  // AUTHORIZED - Render Admin Content
  // ============================================
  return (
    <div className="relative min-h-screen w-full bg-[#0a0a0a]">
      {/* Security Badge */}
      <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-lg bg-green-500/10 border border-green-500/20 px-3 py-1.5 text-xs text-green-400">
        <Shield className="h-3 w-3" />
        <span>Admin Mode</span>
        <span className="text-green-500/60">({userRole})</span>
      </div>

      {children}
    </div>
  );
}
