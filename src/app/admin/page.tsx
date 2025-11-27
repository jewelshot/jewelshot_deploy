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
import { SearchFilters, type FilterOptions, type SortOption } from '@/components/admin/molecules/SearchFilters';
import { UserActionMenu } from '@/components/admin/molecules/UserActionMenu';
import { UserDetailModal } from '@/components/admin/molecules/UserDetailModal';
import { OperationsChart } from '@/components/admin/organisms/OperationsChart';
import { CostChart } from '@/components/admin/organisms/CostChart';
import { UserGrowthChart } from '@/components/admin/organisms/UserGrowthChart';
import { format } from 'date-fns';
import { useToast } from '@/hooks/useToast';
import { Toast } from '@/components/atoms/Toast';

export default function AdminDashboard() {
  const { showToast, toastState, hideToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [authKey, setAuthKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Data states
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [workers, setWorkers] = useState<any>(null);
  const [costs, setCosts] = useState<any>(null);
  
  // Chart data
  const [chartData, setChartData] = useState<any>(null);
  
  // UI states
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showUserDetail, setShowUserDetail] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'charts'>('overview');

  // Search & Filter functions
  const handleSearch = (query: string) => {
    let filtered = users;
    
    if (query) {
      filtered = filtered.filter(user =>
        user.email?.toLowerCase().includes(query.toLowerCase()) ||
        user.id?.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    setFilteredUsers(filtered);
  };

  const handleFilter = (filters: FilterOptions) => {
    let filtered = users;
    
    // Credit range
    if (filters.creditRange && filters.creditRange !== 'all') {
      filtered = filtered.filter(user => {
        const balance = user.credits?.balance || 0;
        if (filters.creditRange === '0-10') return balance <= 10;
        if (filters.creditRange === '10-50') return balance > 10 && balance <= 50;
        if (filters.creditRange === '50+') return balance > 50;
        return true;
      });
    }
    
    // Date range (joined)
    if (filters.dateRange && filters.dateRange !== 'all') {
      const now = new Date();
      filtered = filtered.filter(user => {
        const createdAt = new Date(user.created_at);
        if (filters.dateRange === '1d') {
          return (now.getTime() - createdAt.getTime()) <= 86400000;
        }
        if (filters.dateRange === '7d') {
          return (now.getTime() - createdAt.getTime()) <= 604800000;
        }
        if (filters.dateRange === '30d') {
          return (now.getTime() - createdAt.getTime()) <= 2592000000;
        }
        return true;
      });
    }
    
    setFilteredUsers(filtered);
  };

  const handleSort = (sortBy: SortOption) => {
    const sorted = [...filteredUsers];
    
    if (sortBy === 'created_desc') {
      sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortBy === 'created_asc') {
      sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    } else if (sortBy === 'operations_desc') {
      sorted.sort((a, b) => (b.stats?.total_operations || 0) - (a.stats?.total_operations || 0));
    } else if (sortBy === 'credits_desc') {
      sorted.sort((a, b) => (b.credits?.balance || 0) - (a.credits?.balance || 0));
    }
    
    setFilteredUsers(sorted);
  };

  // User actions
  const handleViewDetails = async (userId: string) => {
    try {
      const headers = { Authorization: `Bearer ${authKey}` };
      const res = await fetch(`/api/admin/users/${userId}`, { headers });
      if (!res.ok) throw new Error('Failed to fetch user details');
      
      const data = await res.json();
      setSelectedUser(data);
      setShowUserDetail(true);
    } catch (err: any) {
      showToast(err.message || 'Failed to load user details', 'error');
    }
  };

  const handleAddCredits = async (userId: string, userEmail: string) => {
    const amount = prompt(`How many credits to add for ${userEmail}?`);
    if (!amount || isNaN(Number(amount))) return;
    
    try {
      const headers = { Authorization: `Bearer ${authKey}`, 'Content-Type': 'application/json' };
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ action: 'add_credits', amount: Number(amount) }),
      });
      
      if (!res.ok) throw new Error('Failed to add credits');
      
      showToast(`Added ${amount} credits to ${userEmail}`, 'success');
      fetchAllData();
    } catch (err: any) {
      showToast(err.message || 'Failed to add credits', 'error');
    }
  };

  const handleRemoveCredits = async (userId: string, userEmail: string) => {
    const amount = prompt(`How many credits to remove from ${userEmail}?`);
    if (!amount || isNaN(Number(amount))) return;
    
    try {
      const headers = { Authorization: `Bearer ${authKey}`, 'Content-Type': 'application/json' };
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ action: 'remove_credits', amount: Number(amount) }),
      });
      
      if (!res.ok) throw new Error('Failed to remove credits');
      
      showToast(`Removed ${amount} credits from ${userEmail}`, 'success');
      fetchAllData();
    } catch (err: any) {
      showToast(err.message || 'Failed to remove credits', 'error');
    }
  };

  const handleBanUser = async (userId: string, userEmail: string) => {
    if (!confirm(`Are you sure you want to ban ${userEmail}?`)) return;
    
    try {
      const headers = { Authorization: `Bearer ${authKey}`, 'Content-Type': 'application/json' };
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ action: 'ban' }),
      });
      
      if (!res.ok) throw new Error('Failed to ban user');
      
      showToast(`Banned ${userEmail}`, 'success');
      fetchAllData();
    } catch (err: any) {
      showToast(err.message || 'Failed to ban user', 'error');
    }
  };

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    if (!confirm(`⚠️ PERMANENTLY DELETE ${userEmail}? This cannot be undone!`)) return;
    
    try {
      const headers = { Authorization: `Bearer ${authKey}` };
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers,
      });
      
      if (!res.ok) throw new Error('Failed to delete user');
      
      showToast(`Deleted ${userEmail}`, 'success');
      fetchAllData();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete user', 'error');
    }
  };

  const fetchAllData = async () => {
    if (!authKey) {
      setError('Please enter admin key');
      return;
    }

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
      setFilteredUsers(usersData.users || []);
      setActivities(activitiesData.activities || []);
      setImages(imagesData.images || []);
      setAnalytics(analyticsData);
      
      // Generate chart data from analytics
      if (analyticsData) {
        setChartData({
          operations: analyticsData.dailyOperations || [],
          costs: analyticsData.dailyCosts || [],
          users: analyticsData.dailyUsers || [],
        });
      }
      
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

  // Check localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('admin_key');
    if (savedKey) {
      setAuthKey(savedKey);
      setIsAuthenticated(true);
    }
  }, []);

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
      <div className="flex h-screen w-screen items-center justify-center bg-[#0a0a0a] p-6 overflow-y-auto">
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
              className="w-full rounded-lg bg-purple-600 px-4 py-3 font-semibold text-white transition-all hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </span>
              ) : (
                'Access Dashboard'
              )}
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
    <div className="h-screen w-screen overflow-y-auto bg-[#0a0a0a]">
      <div className="mx-auto max-w-[1920px] space-y-6 p-6 pb-12">
        
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

        {/* Stats Grid - Row 1 */}
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
            title="Queue Waiting"
            value={workers?.summary?.totalWaiting || 0}
            icon={TrendingUp}
            color="purple"
          />
          <StatCard
            title="Failed Jobs"
            value={workers?.summary?.totalFailed || 0}
            icon={AlertCircle}
            color="red"
          />
        </div>

        {/* Stats Grid - Row 2 */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
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
          <StatCard
            title="Active Users (7d)"
            value={costs?.summary?.activeUsers || 0}
            icon={Users}
            color="blue"
          />
          <StatCard
            title="Total Credits Issued"
            value={users.reduce((sum, u) => sum + (u.credits?.total_earned || 0), 0)}
            icon={DollarSign}
            color="green"
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

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-white/10">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-3 text-sm font-medium transition-all ${
              activeTab === 'overview'
                ? 'border-b-2 border-purple-500 text-white'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('charts')}
            className={`px-4 py-3 text-sm font-medium transition-all ${
              activeTab === 'charts'
                ? 'border-b-2 border-purple-500 text-white'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Charts & Trends
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Analytics Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              
              {/* Top Operations (7d) */}
              <DataCard title="Top Operations (7d)">
            <div className="space-y-3">
              {analytics?.topOperations?.map((op: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-sm text-white/80">{op.operation}</span>
                  <Badge variant="info">{op.count}</Badge>
                </div>
              ))}
            </div>
          </DataCard>

          {/* Top Presets (7d) */}
          <DataCard title="Top Presets (7d)">
            <div className="space-y-3">
              {analytics?.topPresets?.map((preset: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-sm text-white/80">{preset.preset}</span>
                  <Badge variant="purple">{preset.count}</Badge>
                </div>
              ))}
            </div>
          </DataCard>

          {/* Cost Breakdown (7d) */}
          <DataCard title="Cost Breakdown (7d)">
            <div className="space-y-3">
              {costs?.costsByOperation && Object.entries(costs.costsByOperation)
                .slice(0, 6)
                .map(([op, credits]: [string, any], idx: number) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-sm text-white/80">{op}</span>
                    <span className="text-sm font-semibold text-white">{credits} cr</span>
                  </div>
                ))}
            </div>
          </DataCard>
        </div>

        {/* Users Table */}
        <DataCard title="User Management">
          {/* Search & Filters */}
          <div className="mb-6">
            <SearchFilters
              onSearch={handleSearch}
              onFilter={handleFilter}
              onSort={handleSort}
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 text-left text-sm text-white/60">
                  <th className="pb-3">Email</th>
                  <th className="pb-3">Balance</th>
                  <th className="pb-3">Spent</th>
                  <th className="pb-3">Earned</th>
                  <th className="pb-3">Operations</th>
                  <th className="pb-3">Joined</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3 text-white">{user.email}</td>
                    <td className="py-3">
                      <Badge variant={user.credits.balance > 10 ? 'success' : 'warning'}>
                        {user.credits.balance}
                      </Badge>
                    </td>
                    <td className="py-3 text-white/60">{user.credits.total_spent}</td>
                    <td className="py-3 text-white/60">{user.credits.total_earned}</td>
                    <td className="py-3">
                      <Badge variant="info">{user.stats.total_operations}</Badge>
                    </td>
                    <td className="py-3 text-white/60">
                      {format(new Date(user.created_at), 'MMM d, yyyy')}
                    </td>
                    <td className="py-3 text-right">
                      <UserActionMenu
                        userId={user.id}
                        userEmail={user.email}
                        onViewDetails={() => handleViewDetails(user.id)}
                        onAddCredits={() => handleAddCredits(user.id, user.email)}
                        onRemoveCredits={() => handleRemoveCredits(user.id, user.email)}
                        onBanUser={() => handleBanUser(user.id, user.email)}
                        onDeleteUser={() => handleDeleteUser(user.id, user.email)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DataCard>

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
        <DataCard title="Recent Generations (12 Latest)">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {images.slice(0, 12).map((image) => (
              <div key={image.id} className="group relative overflow-hidden rounded-lg border border-white/10">
                <img
                  src={image.url}
                  alt="Generated"
                  className="h-32 w-full object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-xs font-medium text-white">{image.batch_name || 'Studio'}</p>
                    <p className="text-xs text-white/60">
                      {format(new Date(image.created_at), 'MMM d, HH:mm')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DataCard>

        {/* Recent Prompts */}
        {analytics?.recentPrompts && analytics.recentPrompts.length > 0 && (
          <DataCard title="Recent User Prompts">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {analytics.recentPrompts.slice(0, 6).map((prompt: string, idx: number) => (
                <div key={idx} className="rounded-lg border border-white/10 bg-white/5 p-3">
                  <p className="text-sm text-white/80 line-clamp-2">{prompt}</p>
                </div>
              ))}
            </div>
          </DataCard>
        )}
        </>
        )}

        {/* Charts Tab */}
        {activeTab === 'charts' && chartData && (
          <div className="space-y-6">
            {/* Operations Chart */}
            {chartData.operations && chartData.operations.length > 0 && (
              <OperationsChart data={chartData.operations} />
            )}

            {/* Grid: Cost & User Growth */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {chartData.costs && chartData.costs.length > 0 && (
                <CostChart data={chartData.costs} />
              )}
              {chartData.users && chartData.users.length > 0 && (
                <UserGrowthChart data={chartData.users} />
              )}
            </div>
          </div>
        )}

        {/* User Detail Modal */}
        {showUserDetail && selectedUser && (
          <UserDetailModal
            user={selectedUser}
            onClose={() => {
              setShowUserDetail(false);
              setSelectedUser(null);
            }}
          />
        )}

        {/* Toast */}
        {toastState.visible && (
          <Toast
            message={toastState.message}
            type={toastState.type}
            onClose={hideToast}
          />
        )}

      </div>
    </div>
  );
}

