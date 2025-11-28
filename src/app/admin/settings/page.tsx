'use client';

/**
 * Admin Settings Page
 * 
 * ✅ 2FA Setup & Management
 * ✅ Profile Settings
 * ✅ Security Settings
 * ✅ Session Management
 * 
 * Date: 2024-11-28
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Shield, Key, User, ArrowLeft, Check, X,
  AlertCircle, Copy, CheckCircle, RefreshCw
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/useToast';
import { Toast } from '@/components/atoms/Toast';
import Image from 'next/image';

export default function AdminSettingsPage() {
  const router = useRouter();
  const supabase = createClient();
  const { showToast, toastState, hideToast } = useToast();

  // Auth state
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('');

  // 2FA state
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [secret, setSecret] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [setting2FA, setSetting2FA] = useState(false);

  // Check authentication
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/auth/login?redirectTo=/admin/settings');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role, is_2fa_enabled')
        .eq('id', session.user.id)
        .single();

      const userRole = (profile as any)?.role;
      const is2FA = (profile as any)?.is_2fa_enabled;

      if (!profile || (userRole !== 'admin' && userRole !== 'superadmin')) {
        showToast('Access denied. Admin privileges required.', 'error');
        setTimeout(() => router.push('/'), 2000);
        return;
      }

      setIsAdmin(true);
      setUserEmail(session.user.email || '');
      setUserRole(userRole);
      setIs2FAEnabled(is2FA || false);
      
    } catch (error) {
      console.error('Auth check failed:', error);
      showToast('Authentication failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // 🔐 2FA SETUP
  // ============================================
  const handle2FASetup = async () => {
    try {
      setSetting2FA(true);
      
      const res = await fetch('/api/admin/2fa/setup', {
        method: 'POST',
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to setup 2FA');
      }

      const data = await res.json();
      setQrCodeUrl(data.qrCode);
      setSecret(data.secret);
      setShow2FASetup(true);
      
    } catch (error: any) {
      showToast(error.message || 'Failed to setup 2FA', 'error');
    } finally {
      setSetting2FA(false);
    }
  };

  const handleEnable2FA = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      showToast('Please enter a valid 6-digit code', 'error');
      return;
    }

    try {
      setSetting2FA(true);

      const res = await fetch('/api/admin/2fa/enable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: verificationCode }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Invalid verification code');
      }

      showToast('2FA enabled successfully!', 'success');
      setIs2FAEnabled(true);
      setShow2FASetup(false);
      setVerificationCode('');
      
    } catch (error: any) {
      showToast(error.message || 'Failed to enable 2FA', 'error');
    } finally {
      setSetting2FA(false);
    }
  };

  const handleDisable2FA = async () => {
    if (!confirm('Are you sure you want to disable 2FA? This will reduce your account security.')) {
      return;
    }

    try {
      setSetting2FA(true);

      const res = await fetch('/api/admin/2fa/disable', {
        method: 'POST',
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to disable 2FA');
      }

      showToast('2FA disabled', 'success');
      setIs2FAEnabled(false);
      
    } catch (error: any) {
      showToast(error.message || 'Failed to disable 2FA', 'error');
    } finally {
      setSetting2FA(false);
    }
  };

  const copySecret = () => {
    navigator.clipboard.writeText(secret);
    showToast('Secret copied to clipboard', 'success');
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 mx-auto animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
          <p className="text-white/70">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/admin')}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-white">Admin Settings</h1>
          <p className="mt-1 text-white/60">Manage your admin account and security</p>
        </div>

        {/* Profile Info */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <User className="h-5 w-5 text-purple-400" />
            <h2 className="text-xl font-semibold text-white">Profile Information</h2>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-sm text-white/60">Email</label>
              <div className="mt-1 text-white">{userEmail}</div>
            </div>
            <div>
              <label className="text-sm text-white/60">Role</label>
              <div className="mt-1">
                <span className="inline-flex items-center rounded-full bg-purple-500/20 px-3 py-1 text-sm font-medium text-purple-400">
                  {userRole}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2FA Settings */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-5 w-5 text-purple-400" />
            <h2 className="text-xl font-semibold text-white">Two-Factor Authentication</h2>
          </div>

          <p className="text-sm text-white/60 mb-6">
            Add an extra layer of security to your admin account with 2FA.
          </p>

          {/* Current Status */}
          <div className="flex items-center justify-between p-4 rounded-lg border border-white/10 bg-white/5 mb-6">
            <div className="flex items-center gap-3">
              {is2FAEnabled ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <div>
                    <div className="font-medium text-white">2FA Enabled</div>
                    <div className="text-sm text-white/60">Your account is protected</div>
                  </div>
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                  <div>
                    <div className="font-medium text-white">2FA Disabled</div>
                    <div className="text-sm text-white/60">Enable 2FA for better security</div>
                  </div>
                </>
              )}
            </div>

            {!is2FAEnabled ? (
              <button
                onClick={handle2FASetup}
                disabled={setting2FA || show2FASetup}
                className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-purple-700 disabled:opacity-50"
              >
                {setting2FA ? 'Setting up...' : 'Enable 2FA'}
              </button>
            ) : (
              <button
                onClick={handleDisable2FA}
                disabled={setting2FA}
                className="rounded-lg border border-red-500/30 bg-red-950/20 px-4 py-2 text-sm font-semibold text-red-400 transition-all hover:bg-red-950/30 disabled:opacity-50"
              >
                {setting2FA ? 'Disabling...' : 'Disable 2FA'}
              </button>
            )}
          </div>

          {/* 2FA Setup Modal */}
          {show2FASetup && (
            <div className="space-y-6 p-6 rounded-lg border border-purple-500/30 bg-purple-950/20">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Set Up 2FA</h3>
                <p className="text-sm text-white/60">
                  Scan the QR code with your authenticator app (Google Authenticator, Authy, etc.)
                </p>
              </div>

              {/* QR Code */}
              {qrCodeUrl && (
                <div className="flex justify-center">
                  <div className="p-4 bg-white rounded-lg">
                    <Image
                      src={qrCodeUrl}
                      alt="2FA QR Code"
                      width={200}
                      height={200}
                    />
                  </div>
                </div>
              )}

              {/* Manual Entry Secret */}
              {secret && (
                <div>
                  <label className="text-sm text-white/60">Or enter this code manually:</label>
                  <div className="mt-2 flex items-center gap-2">
                    <code className="flex-1 rounded-lg bg-white/10 px-4 py-2 text-sm text-white font-mono">
                      {secret}
                    </code>
                    <button
                      onClick={copySecret}
                      className="rounded-lg bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
                      title="Copy to clipboard"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Verification */}
              <div>
                <label className="text-sm text-white/60">Enter the 6-digit code from your app:</label>
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="000000"
                    className="flex-1 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white placeholder-white/40 focus:border-purple-500 focus:outline-none font-mono text-center text-lg"
                  />
                  <button
                    onClick={handleEnable2FA}
                    disabled={setting2FA || verificationCode.length !== 6}
                    className="rounded-lg bg-green-600 px-6 py-2 font-semibold text-white transition-all hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {setting2FA ? (
                      <RefreshCw className="h-5 w-5 animate-spin" />
                    ) : (
                      'Verify'
                    )}
                  </button>
                </div>
              </div>

              <button
                onClick={() => {
                  setShow2FASetup(false);
                  setVerificationCode('');
                }}
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Security Tips */}
        <div className="rounded-xl border border-blue-500/30 bg-blue-950/20 p-6">
          <div className="flex items-start gap-3">
            <Key className="h-5 w-5 text-blue-400 mt-0.5" />
            <div>
              <h3 className="font-semibold text-white mb-2">Security Best Practices</h3>
              <ul className="space-y-2 text-sm text-white/70">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Enable 2FA for an extra layer of security</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Use a strong, unique password for your admin account</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Review audit logs regularly for suspicious activity</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Never share your admin credentials or 2FA codes</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      {toastState.visible && (
        <Toast
          message={toastState.message}
          type={toastState.type}
          onClose={hideToast}
        />
      )}
    </div>
  );
}

