/**
 * Backup Manager
 * 
 * View backup history and trigger manual backups
 */

'use client';

import { useState, useEffect } from 'react';
import { Database, Download, Clock, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { Badge } from '../atoms/Badge';
import { format } from 'date-fns';
import { createScopedLogger } from '@/lib/logger';

const logger = createScopedLogger('BackupManager');

// ✅ No props needed - uses session-based auth
export function BackupManager() {
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);
  const [backups, setBackups] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchBackups();
  }, []);

  const fetchBackups = async () => {
    try {
      setLoading(true);
      // ✅ Session-based auth - no header needed
      const res = await fetch('/api/admin/backup', {
        credentials: 'include', // Include session cookies
      });
      
      if (!res.ok) throw new Error('Failed to fetch backups');

      const data = await res.json();
      setBackups(data.backups || []);
      setStats(data.stats);
    } catch (error) {
      logger.error('Failed to fetch backups:', error);
    } finally {
      setLoading(false);
    }
  };

  const triggerBackup = async () => {
    const reason = prompt('Reason for backup (optional):');
    
    try {
      setTriggering(true);
      // ✅ Session-based auth - no Authorization header needed
      const res = await fetch('/api/admin/backup', {
        method: 'POST',
        credentials: 'include', // Include session cookies
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      });

      if (!res.ok) throw new Error('Failed to trigger backup');

      const data = await res.json();
      alert(`${data.message}\n\n${data.note}`);
      fetchBackups();
    } catch (error: any) {
      alert(`Failed to trigger backup: ${error.message}`);
    } finally {
      setTriggering(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-white/10 bg-white/5 p-12">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
          <p className="mt-4 text-sm text-white/60">Loading backups...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Database Backups</h2>
          <p className="mt-1 text-sm text-white/60">
            Supabase Pro automatically backs up your database. View history and trigger manual backups.
          </p>
        </div>
        
        <button
          onClick={triggerBackup}
          disabled={triggering}
          className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 font-medium text-white transition-all hover:bg-purple-700 disabled:opacity-50"
        >
          <Database className="h-5 w-5" />
          {triggering ? 'Logging...' : 'Log Manual Backup'}
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-white/60">Total Backups</p>
            <p className="mt-2 text-2xl font-bold text-white">{stats.total_backups || 0}</p>
          </div>
          
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-white/60">Automated</p>
            <p className="mt-2 text-2xl font-bold text-green-400">{stats.automated_backups || 0}</p>
          </div>
          
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-white/60">Manual</p>
            <p className="mt-2 text-2xl font-bold text-purple-400">{stats.manual_backups || 0}</p>
          </div>
          
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-white/60">Last Backup</p>
            <p className="mt-2 text-lg font-bold text-white">
              {stats.last_backup_date 
                ? format(new Date(stats.last_backup_date), 'MMM d, HH:mm')
                : '—'}
            </p>
          </div>
        </div>
      )}

      {/* Supabase Dashboard Link */}
      <div className="rounded-lg border border-blue-500/30 bg-blue-950/20 p-4">
        <div className="flex items-start gap-3">
          <Database className="h-5 w-5 text-blue-400" />
          <div className="flex-1">
            <p className="font-medium text-blue-400">Access Supabase Backups</p>
            <p className="mt-1 text-sm text-white/80">
              View, download, and restore backups from your Supabase Dashboard.
            </p>
            <a
              href="https://supabase.com/dashboard/project/_/database/backups"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"
            >
              Open Supabase Dashboard
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Backup History Table */}
      <div className="overflow-x-auto rounded-lg border border-white/10 bg-white/5">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 text-left text-sm text-white/60">
              <th className="p-3">Date</th>
              <th className="p-3">Type</th>
              <th className="p-3">Method</th>
              <th className="p-3">Triggered By</th>
              <th className="p-3">Reason</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {backups.map((backup) => (
              <tr key={backup.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="p-3 text-white/60">
                  {format(new Date(backup.created_at), 'MMM d, yyyy HH:mm')}
                </td>
                <td className="p-3">
                  <Badge variant={
                    backup.backup_type === 'automated' ? 'success' :
                    backup.backup_type === 'manual' ? 'info' : 'warning'
                  }>
                    {backup.backup_type}
                  </Badge>
                </td>
                <td className="p-3 text-white/80">{backup.backup_method}</td>
                <td className="p-3 text-white/80">{backup.triggered_by || '—'}</td>
                <td className="p-3 text-white/60">{backup.trigger_reason || '—'}</td>
                <td className="p-3">
                  {backup.status === 'completed' ? (
                    <Badge variant="success">
                      <CheckCircle className="mr-1 inline h-3 w-3" />
                      Completed
                    </Badge>
                  ) : backup.status === 'failed' ? (
                    <Badge variant="error">
                      <AlertCircle className="mr-1 inline h-3 w-3" />
                      Failed
                    </Badge>
                  ) : (
                    <Badge variant="warning">
                      <Clock className="mr-1 inline h-3 w-3" />
                      Pending
                    </Badge>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {backups.length === 0 && (
          <div className="p-12 text-center">
            <Database className="mx-auto h-12 w-12 text-white/20" />
            <p className="mt-4 text-white/60">No backup logs yet</p>
            <p className="mt-2 text-sm text-white/40">
              Trigger a manual backup or wait for automated backups
            </p>
          </div>
        )}
      </div>

      {/* Help Section */}
      <div className="rounded-lg border border-white/10 bg-white/5 p-4">
        <h3 className="font-semibold text-white">Backup Information</h3>
        <ul className="mt-3 space-y-2 text-sm text-white/80">
          <li>• <strong>Automated backups</strong> run daily on Supabase Pro plan</li>
          <li>• <strong>Manual backups</strong> can be triggered anytime for important changes</li>
          <li>• <strong>Retention:</strong> Backups are kept for 30 days on Pro plan</li>
          <li>• <strong>Download:</strong> Export backups from Supabase Dashboard</li>
          <li>• <strong>Restore:</strong> Contact support or use CLI tools</li>
        </ul>
      </div>
    </div>
  );
}

