'use client';

/**
 * Comprehensive Admin Dashboard
 * 
 * Full system monitoring and management
 * No sidebar - standalone admin interface
 */

import { useEffect, useState } from 'react';
import { 
  Users, DollarSign, Activity, Image, 
  TrendingUp, Server, Database, AlertCircle,
  RefreshCw, Download, Search, Filter,
  BarChart3, Zap
} from 'lucide-react';
import { StatCard } from '@/components/admin/atoms/StatCard';
import { DataCard } from '@/components/admin/atoms/DataCard';
import { Badge } from '@/components/admin/atoms/Badge';
import { format } from 'date-fns';

const ADMIN_KEY = typeof window !== 'undefined' 
  ? localStorage.getItem('admin_key') || '' 
  : '';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [authKey, setAuthKey] = useState(ADMIN_KEY);
  const [isAuthenticated, setIsAuthenticated] = useState(!!ADMIN_KEY);
  const [error, setError] = useState<string | null>(null);

  // Data states
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [workers, setWorkers] = useState<any>(null);
  const [costs, setCosts] = useState<any>(null);

  const fetchAllData = async () => {
    if (!authKey) return;

    try {
      setLoading(true);
      setError(null);
      const headers = { Authorization: `Bearer ${authKey}` };

      const [
        workersRes, costsRes, usersRes, 
        activitiesRes, imagesRes, analyticsRes
      ] = await Promise.all([
        fetch('/api/admin/workers', { headers }),
        fetch('/api/admin/costs?period=7d', { headers }),
        fetch('/api/admin/users?limit=10', { headers }),
        fetch('/api/admin/activities?limit=50', { headers }),
        fetch('/api/admin/images?limit=12', { headers }),
        fetch('/api/admin/analytics?period=7d', { headers }),
      ]);

      if (!workersRes.ok) throw new Error('Authentication failed');

      const [
        workersData, costsData, usersData,
        activitiesData, imagesData, analyticsData
      ] = await Promise.all([
        workersRes.json(),
        costsRes.json(),
        usersRes.json(),
        activitiesRes.json(),
        imagesRes.json(),
        analyticsRes.json(),
      ]);

      setWorkers(workersData);
      setCosts(costsData);
      setUsers(usersData.users || []);
      setActivities(activitiesData.activities || []);
      setImages(imagesData.images || []);
      setAnalytics(analyticsData);
      
      setIsAuthenticated(true);
      localStorage.setItem('admin_key', authKey);
    } catch (err: any) {
      setError(err.message);
      setIsAuthenticated(false);
      localStorage.removeItem('admin_key');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && authKey) {
      fetchAllData();
      const interval = setInterval(fetchAllData, 30000); // Refresh every 30s
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
            <h1 className="mt-4 text-2xl font-bold text-white">Jewelshot Admin</h1>
            <p className="mt-2 text-sm text-white/60">Comprehensive system dashboard</p>
          </div>
          
          <div className="space-y-4">
            <input
              type="password"
              placeholder="Admin Key"
              value={authKey}
              onChange={(e) => setAuthKey(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchAllData()}
              className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/40 focus:border-purple-500 focus:outline-none"
            />
            
            <button
              onClick={fetchAllData}
              disabled={!authKey || loading}
              className="w-full rounded-lg bg-purple-600 px-4 py-3 font-semibold text-white transition-all hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Access Dashboard'}
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
      <div className="mx-auto max-w-[1920px] space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Jewelshot Admin Dashboard</h1>
            <p className="mt-1 text-white/60">Real-time system monitoring & management</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchAllData}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/20"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={() => {
                setIsAuthenticated(false);
                localStorage.removeItem('admin_key');
              }}
              className="rounded-lg border border-red-500/30 bg-red-950/20 px-4 py-2 text-sm font-medium text-red-400 transition-all hover:bg-red-950/30"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Users"
            value={users.length}
            icon={Users}
            color="blue"
          />
          <StatCard
            title="Active Operations"
            value={workers?.summary?.totalActive || 0}
            icon={Activity}
            color="green"
          />
          <StatCard
            title="Total Operations (7d)"
            value={costs?.summary?.totalOperations || 0}
            icon={Zap}
            color="purple"
          />
          <StatCard
            title="Estimated Cost (7d)"
            value={`$${costs?.summary?.estimatedCostUSD || '0.00'}`}
            icon={DollarSign}
            color="orange"
          />
        </div>

        {/* Workers & Queue Status */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <DataCard title="Worker Status">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-white/60">Status</p>
                <p className="mt-1 text-lg font-semibold">
                  {workers?.worker?.status === 'ok' ? (
                    <span className="text-green-400">● Online</span>
                  ) : (
                    <span className="text-red-400">● Offline</span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-white/60">Memory</p>
                <p className="mt-1 text-lg font-semibold text-white">
                  {workers?.worker?.memory?.heapUsed || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-white/60">Uptime</p>
                <p className="mt-1 text-lg font-semibold text-white">
                  {workers?.worker?.uptime ? `${Math.floor(workers.worker.uptime / 60)}m` : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-white/60">Redis</p>
                <p className="mt-1 text-lg font-semibold">
                  {workers?.redis?.status === 'connected' ? (
                    <span className="text-green-400">● Connected</span>
                  ) : (
                    <span className="text-red-400">● Disconnected</span>
                  )}
                </p>
              </div>
            </div>
          </DataCard>

          <DataCard title="Queue Stats">
            <div className="space-y-3">
              {workers?.queues && Object.entries(workers.queues).map(([name, queue]: [string, any]) => (
                <div key={name} className="flex items-center justify-between">
                  <div>
                    <span className="font-medium capitalize text-white">{name}</span>
                    <div className="mt-1 flex gap-2 text-sm text-white/60">
                      <span>Wait: {queue.waiting}</span>
                      <span>Active: {queue.active}</span>
                      <span>Failed: {queue.failed}</span>
                    </div>
                  </div>
                  <Badge variant={queue.active > 0 ? 'success' : 'neutral'}>
                    {queue.workers} worker{queue.workers !== 1 ? 's' : ''}
                  </Badge>
                </div>
              ))}
            </div>
          </DataCard>
        </div>

        {/* Users & Analytics */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          
          {/* Recent Users */}
          <DataCard title="Recent Users" className="lg:col-span-2">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 text-left text-sm text-white/60">
                    <th className="pb-3">Email</th>
                    <th className="pb-3">Credits</th>
                    <th className="pb-3">Operations</th>
                    <th className="pb-3">Joined</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {users.slice(0, 10).map((user) => (
                    <tr key={user.id} className="border-b border-white/5">
                      <td className="py-3 text-white">{user.email}</td>
                      <td className="py-3">
                        <Badge variant={user.credits.balance > 10 ? 'success' : 'warning'}>
                          {user.credits.balance}
                        </Badge>
                      </td>
                      <td className="py-3 text-white/80">{user.stats.total_operations}</td>
                      <td className="py-3 text-white/60">
                        {format(new Date(user.created_at), 'MMM d, yyyy')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DataCard>

          {/* Top Presets */}
          <DataCard title="Top Presets (7d)">
            <div className="space-y-2">
              {analytics?.topPresets?.slice(0, 5).map((preset: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <span className="text-white/80">{preset.preset}</span>
                  <Badge variant="neutral">{preset.count}</Badge>
                </div>
              ))}
            </div>
          </DataCard>
        </div>

        {/* Recent Activities */}
        <DataCard title="Recent Activities">
          <div className="space-y-3">
            {activities.slice(0, 15).map((activity) => (
              <div key={activity.id} className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={activity.type === 'batch' ? 'info' : 'success'}>
                      {activity.type}
                    </Badge>
                    <span className="text-sm text-white">
                      {activity.type === 'batch' ? activity.name : activity.operation}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-white/60">
                    {format(new Date(activity.timestamp), 'MMM d, HH:mm:ss')}
                  </p>
                </div>
                {activity.credits_used && (
                  <span className="text-sm text-white/80">{activity.credits_used} credits</span>
                )}
              </div>
            ))}
          </div>
        </DataCard>

        {/* Recent Images */}
        <DataCard title="Recent Generations">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {images.slice(0, 12).map((image) => (
              <div key={image.id} className="group relative overflow-hidden rounded-lg">
                <img
                  src={image.url}
                  alt="Generated"
                  className="h-32 w-full object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-xs text-white/80">{image.batch_name || 'Studio'}</p>
                    <p className="text-xs text-white/60">
                      {format(new Date(image.created_at), 'MMM d, HH:mm')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DataCard>

      </div>
    </div>
  );
}

