/**
 * Audit Logs Viewer
 * 
 * Display admin activity logs for security & compliance
 */

'use client';

import { useState, useEffect } from 'react';
import { Shield, AlertCircle, CheckCircle, XCircle, Search } from 'lucide-react';
import { Badge } from '../atoms/Badge';
import { format } from 'date-fns';
import { createScopedLogger } from '@/lib/logger';

const logger = createScopedLogger('AuditLogsViewer');

interface AuditLog {
  id: string;
  admin_email: string;
  admin_ip: string;
  action_type: string;
  action_category: string;
  target_type?: string;
  target_id?: string;
  target_email?: string;
  action_details: Record<string, any>;
  success: boolean;
  error_message?: string;
  created_at: string;
}

// ✅ No props needed - uses session-based auth
export function AuditLogsViewer() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchLogs();
  }, [filterCategory]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      // ✅ Session-based auth - no header needed
      const url = new URL('/api/admin/audit-logs', window.location.origin);
      url.searchParams.set('limit', '100');
      
      if (filterCategory !== 'all') {
        url.searchParams.set('action_category', filterCategory);
      }

      const res = await fetch(url.toString(), {
        credentials: 'include', // Include session cookies
      });
      if (!res.ok) throw new Error('Failed to fetch logs');

      const data = await res.json();
      setLogs(data.logs || []);
      setSummary(data.summary);
    } catch (error) {
      logger.error('Failed to fetch audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      log.admin_email.toLowerCase().includes(query) ||
      log.action_type.toLowerCase().includes(query) ||
      log.target_email?.toLowerCase().includes(query)
    );
  });

  const getCategoryColor = (category: string): 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'purple' => {
    switch (category) {
      case 'security': return 'error';
      case 'credit_management': return 'warning';
      case 'user_management': return 'info';
      case 'authentication': return 'success';
      case 'system_config': return 'purple';
      default: return 'neutral';
    }
  };

  const getActionIcon = (actionType: string) => {
    if (actionType.includes('ban') || actionType.includes('delete')) {
      return <XCircle className="h-4 w-4 text-red-400" />;
    }
    if (actionType.includes('credit')) {
      return <Shield className="h-4 w-4 text-yellow-400" />;
    }
    return <CheckCircle className="h-4 w-4 text-green-400" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-white/10 bg-white/5 p-12">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
          <p className="mt-4 text-sm text-white/60">Loading audit logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      
      {/* Summary Stats */}
      {summary && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-white/60">Total Logs</p>
            <p className="mt-2 text-2xl font-bold text-white">{summary.totalLogs}</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-white/60">Last 7 Days</p>
            <p className="mt-2 text-2xl font-bold text-white">{summary.last7Days}</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-white/60">Success Rate</p>
            <p className="mt-2 text-2xl font-bold text-green-400">{summary.successRate}%</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-white/60">Categories</p>
            <p className="mt-2 text-2xl font-bold text-white">
              {summary.byCategory ? Object.keys(summary.byCategory).length : 0}
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search by admin email, action, or target..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-white/20 bg-white/10 py-2 pl-10 pr-4 text-white placeholder-white/40 focus:border-purple-500 focus:outline-none"
          />
        </div>
        
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white focus:border-purple-500 focus:outline-none"
        >
          <option value="all">All Categories</option>
          <option value="authentication">Authentication</option>
          <option value="user_management">User Management</option>
          <option value="credit_management">Credit Management</option>
          <option value="security">Security</option>
          <option value="system_config">System Config</option>
        </select>
      </div>

      {/* Logs Table */}
      <div className="overflow-x-auto rounded-lg border border-white/10 bg-white/5">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 text-left text-sm text-white/60">
              <th className="p-3">Timestamp</th>
              <th className="p-3">Admin</th>
              <th className="p-3">Action</th>
              <th className="p-3">Category</th>
              <th className="p-3">Target</th>
              <th className="p-3">Status</th>
              <th className="p-3">IP</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="p-3 text-white/60">
                  {format(new Date(log.created_at), 'MMM d, HH:mm:ss')}
                </td>
                <td className="p-3 text-white">{log.admin_email}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    {getActionIcon(log.action_type)}
                    <span className="text-white">{log.action_type}</span>
                  </div>
                </td>
                <td className="p-3">
                  <Badge variant={getCategoryColor(log.action_category)}>
                    {log.action_category}
                  </Badge>
                </td>
                <td className="p-3 text-white/80">
                  {log.target_email || log.target_id?.slice(0, 8) || '—'}
                </td>
                <td className="p-3">
                  {log.success ? (
                    <Badge variant="success">Success</Badge>
                  ) : (
                    <Badge variant="error">Failed</Badge>
                  )}
                </td>
                <td className="p-3 font-mono text-xs text-white/60">{log.admin_ip || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredLogs.length === 0 && (
          <div className="p-12 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-white/20" />
            <p className="mt-4 text-white/60">No audit logs found</p>
          </div>
        )}
      </div>
    </div>
  );
}

