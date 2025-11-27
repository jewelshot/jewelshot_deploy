/**
 * User Detail Modal
 * 
 * Comprehensive user information modal
 */

'use client';

import { X, Mail, Calendar, Activity, DollarSign, Image as ImageIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '../atoms/Badge';

interface UserDetailModalProps {
  user: any;
  onClose: () => void;
}

export function UserDetailModal({ user, onClose }: UserDetailModalProps) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl border border-white/10 bg-[#1a1a1a] shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#1a1a1a] px-6 py-4">
          <div>
            <h2 className="text-2xl font-bold text-white">User Details</h2>
            <p className="mt-1 text-sm text-white/60">{user.email}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg border border-white/20 bg-white/10 p-2 transition-all hover:bg-white/20"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 p-6">
          
          {/* Basic Info */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-2 text-white/60">
                <Mail className="h-4 w-4" />
                <span className="text-sm font-medium">Email</span>
              </div>
              <p className="mt-2 text-lg text-white">{user.email}</p>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-2 text-white/60">
                <Calendar className="h-4 w-4" />
                <span className="text-sm font-medium">Joined</span>
              </div>
              <p className="mt-2 text-lg text-white">
                {format(new Date(user.created_at), 'MMM d, yyyy HH:mm')}
              </p>
            </div>
          </div>

          {/* Credit Stats */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-lg border border-green-500/30 bg-green-950/20 p-4">
              <p className="text-sm text-green-400">Balance</p>
              <p className="mt-2 text-2xl font-bold text-white">{user.credits.balance}</p>
            </div>
            
            <div className="rounded-lg border border-orange-500/30 bg-orange-950/20 p-4">
              <p className="text-sm text-orange-400">Reserved</p>
              <p className="mt-2 text-2xl font-bold text-white">{user.credits.reserved}</p>
            </div>
            
            <div className="rounded-lg border border-blue-500/30 bg-blue-950/20 p-4">
              <p className="text-sm text-blue-400">Total Earned</p>
              <p className="mt-2 text-2xl font-bold text-white">{user.credits.total_earned}</p>
            </div>
            
            <div className="rounded-lg border border-purple-500/30 bg-purple-950/20 p-4">
              <p className="text-sm text-purple-400">Total Spent</p>
              <p className="mt-2 text-2xl font-bold text-white">{user.credits.total_spent}</p>
            </div>
          </div>

          {/* Operation Stats */}
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <h3 className="mb-4 text-lg font-semibold text-white">Operations Breakdown</h3>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {Object.entries(user.stats.operations_by_type || {}).map(([op, count]: [string, any]) => (
                <div key={op} className="flex items-center justify-between rounded border border-white/10 bg-white/5 px-3 py-2">
                  <span className="text-sm text-white/80">{op}</span>
                  <Badge variant="neutral">{count}</Badge>
                </div>
              ))}
            </div>
            {Object.keys(user.stats.operations_by_type || {}).length === 0 && (
              <p className="text-center text-sm text-white/40">No operations yet</p>
            )}
          </div>

          {/* Activity Summary */}
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <h3 className="mb-4 text-lg font-semibold text-white">Activity Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Total Operations</span>
                <span className="font-semibold text-white">{user.stats.total_operations}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Last Sign In</span>
                <span className="font-semibold text-white">
                  {user.last_sign_in_at 
                    ? format(new Date(user.last_sign_in_at), 'MMM d, yyyy HH:mm')
                    : 'Never'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Email Verified</span>
                <Badge variant={user.email_confirmed_at ? 'success' : 'warning'}>
                  {user.email_confirmed_at ? 'Yes' : 'No'}
                </Badge>
              </div>
            </div>
          </div>

          {/* User ID */}
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-white/40">User ID</p>
            <p className="mt-1 font-mono text-xs text-white/60">{user.id}</p>
          </div>

        </div>
      </div>
    </div>
  );
}

