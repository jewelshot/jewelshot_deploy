'use client';

/**
 * Admin Dashboard
 * 
 * Real-time monitoring of queues, workers, and costs
 */

import { useEffect, useState } from 'react';
import { RefreshCw, Activity, DollarSign, Server, AlertCircle } from 'lucide-react';

const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY || '';

export default function AdminDashboard() {
  const [workers, setWorkers] = useState<any>(null);
  const [costs, setCosts] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authKey, setAuthKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchData = async () => {
    if (!authKey) return;

    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${authKey}` };

      const [workersRes, costsRes] = await Promise.all([
        fetch('/api/admin/workers', { headers }),
        fetch('/api/admin/costs?period=7d', { headers }),
      ]);

      if (!workersRes.ok || !costsRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const workersData = await workersRes.json();
      const costsData = await costsRes.json();

      setWorkers(workersData);
      setCosts(costsData);
      setIsAuthenticated(true);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
      const interval = setInterval(fetchData, 10000); // Refresh every 10s
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, authKey]);

  // Login form
  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0a0a]">
        <div className="w-full max-w-md space-y-6 rounded-xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
          <div className="text-center">
            <Server className="mx-auto h-12 w-12 text-purple-400" />
            <h1 className="mt-4 text-2xl font-bold text-white">Admin Dashboard</h1>
            <p className="mt-2 text-sm text-white/60">Enter admin key to access metrics</p>
          </div>
          
          <div className="space-y-4">
            <input
              type="password"
              placeholder="Admin Key"
              value={authKey}
              onChange={(e) => setAuthKey(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchData()}
              className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/40 focus:border-purple-500 focus:outline-none"
            />
            
            <button
              onClick={fetchData}
              disabled={!authKey}
              className="w-full rounded-lg bg-purple-600 px-4 py-3 font-semibold text-white transition-all hover:bg-purple-700 disabled:opacity-50"
            >
              Access Dashboard
            </button>

            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-950/20 p-3 text-center text-sm text-red-400">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="mt-1 text-white/60">Real-time system monitoring</p>
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/20 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Queue Summary */}
          <StatCard
            icon={<Activity className="h-6 w-6" />}
            title="Total Waiting"
            value={workers?.summary?.totalWaiting || 0}
            color="blue"
          />
          <StatCard
            icon={<Activity className="h-6 w-6" />}
            title="Total Active"
            value={workers?.summary?.totalActive || 0}
            color="green"
          />
          <StatCard
            icon={<Activity className="h-6 w-6" />}
            title="Total Failed"
            value={workers?.summary?.totalFailed || 0}
            color="red"
          />
          <StatCard
            icon={<DollarSign className="h-6 w-6" />}
            title="Cost (7d)"
            value={`$${costs?.summary?.estimatedCostUSD || '0.00'}`}
            color="purple"
          />
        </div>

        {/* Worker Health */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <h2 className="mb-4 text-xl font-semibold text-white">Worker Status</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-white/60">Status</p>
              <p className="mt-1 text-lg font-semibold text-white">
                {workers?.worker?.status === 'ok' ? (
                  <span className="text-green-400">● Online</span>
                ) : (
                  <span className="text-red-400">● Offline</span>
                )}
              </p>
            </div>
            <div>
              <p className="text-sm text-white/60">Uptime</p>
              <p className="mt-1 text-lg font-semibold text-white">
                {workers?.worker?.uptime ? `${Math.floor(workers.worker.uptime / 60)}m` : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-white/60">Memory Usage</p>
              <p className="mt-1 text-lg font-semibold text-white">
                {workers?.worker?.memory?.heapUsed || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-white/60">Redis</p>
              <p className="mt-1 text-lg font-semibold text-white">
                {workers?.redis?.status === 'connected' ? (
                  <span className="text-green-400">● Connected</span>
                ) : (
                  <span className="text-red-400">● Disconnected</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Queue Details */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {workers?.queues && Object.entries(workers.queues).map(([name, queue]: [string, any]) => (
            <QueueCard key={name} name={name} queue={queue} />
          ))}
        </div>

        {/* Cost Breakdown */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <h2 className="mb-4 text-xl font-semibold text-white">Cost Breakdown (7 days)</h2>
          <div className="space-y-3">
            {costs?.costsByOperation && Object.entries(costs.costsByOperation).map(([op, credits]: [string, any]) => (
              <div key={op} className="flex items-center justify-between">
                <span className="text-white/80">{op}</span>
                <span className="font-semibold text-white">{credits} credits</span>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-white/10 pt-4">
            <div className="flex items-center justify-between text-lg font-semibold">
              <span className="text-white">Total Operations</span>
              <span className="text-white">{costs?.summary?.totalOperations || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, color }: any) {
  const colorClasses = {
    blue: 'border-blue-500/30 bg-blue-950/20 text-blue-400',
    green: 'border-green-500/30 bg-green-950/20 text-green-400',
    red: 'border-red-500/30 bg-red-950/20 text-red-400',
    purple: 'border-purple-500/30 bg-purple-950/20 text-purple-400',
  };

  return (
    <div className={`rounded-xl border ${colorClasses[color as keyof typeof colorClasses]} p-6 backdrop-blur-sm`}>
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className="text-sm opacity-80">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}

function QueueCard({ name, queue }: any) {
  if (!queue) return null;

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
      <h3 className="mb-4 text-lg font-semibold capitalize text-white">{name}</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-white/60">Waiting</span>
          <span className="font-semibold text-white">{queue.waiting || 0}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Active</span>
          <span className="font-semibold text-green-400">{queue.active || 0}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Completed</span>
          <span className="font-semibold text-blue-400">{queue.completed || 0}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Failed</span>
          <span className="font-semibold text-red-400">{queue.failed || 0}</span>
        </div>
        <div className="flex justify-between border-t border-white/10 pt-2">
          <span className="text-white/60">Workers</span>
          <span className="font-semibold text-white">{queue.workers || 0}</span>
        </div>
      </div>

      {queue.recentFailures && queue.recentFailures.length > 0 && (
        <div className="mt-4 rounded-lg border border-red-500/30 bg-red-950/20 p-3">
          <div className="flex items-center gap-2 text-xs text-red-400">
            <AlertCircle className="h-4 w-4" />
            <span>{queue.recentFailures.length} recent failure(s)</span>
          </div>
        </div>
      )}
    </div>
  );
}

