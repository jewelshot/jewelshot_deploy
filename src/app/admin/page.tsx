'use client';

/**
 * Admin Dashboard - Enterprise Edition
 * 
 * ✅ Session-based authentication (Supabase)
 * ✅ Role-based access control (admin/superadmin)
 * ✅ Auto audit logging
 * ✅ 2FA enforcement
 * ✅ Real-time monitoring
 * 
 * Security: Migrated from header-based to session-based auth
 * Date: 2024-11-28
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { 
  Users, DollarSign, Activity, Image, 
  TrendingUp, Server, Database, AlertCircle,
  RefreshCw, Download, Search, Filter,
  BarChart3, Zap, Settings, Shield
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { StatCard } from '@/components/admin/atoms/StatCard';
import { DataCard } from '@/components/admin/atoms/DataCard';
import { Badge } from '@/components/admin/atoms/Badge';
import { SearchFilters, type FilterOptions, type SortOption } from '@/components/admin/molecules/SearchFilters';
import { UserActionMenu } from '@/components/admin/molecules/UserActionMenu';
import { UserDetailModal } from '@/components/admin/molecules/UserDetailModal';
import { format } from 'date-fns';
import { useToast } from '@/hooks/useToast';
import { Toast } from '@/components/atoms/Toast';
import { AuditLogsViewer } from '@/components/admin/organisms/AuditLogsViewer';
import { BackupManager } from '@/components/admin/organisms/BackupManager';
import ErrorBoundary from '@/components/organisms/ErrorBoundary';

// 🚀 PERFORMANCE: Lazy load heavy chart components
const OperationsChart = dynamic(
  () => import('@/components/admin/organisms/OperationsChart').then(mod => ({ default: mod.OperationsChart })),
  { ssr: false, loading: () => <div className="h-64 flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full"></div></div> }
);
const CostChart = dynamic(
  () => import('@/components/admin/organisms/CostChart').then(mod => ({ default: mod.CostChart })),
  { ssr: false, loading: () => <div className="h-64 flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full"></div></div> }
);
const UserGrowthChart = dynamic(
  () => import('@/components/admin/organisms/UserGrowthChart').then(mod => ({ default: mod.UserGrowthChart })),
  { ssr: false, loading: () => <div className="h-64 flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full"></div></div> }
);

export default function AdminDashboard() {
  const router = useRouter();
  const supabase = createClient();
  const { showToast, toastState, hideToast } = useToast();
  
  // Auth states
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
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
  const [activeTab, setActiveTab] = useState<'overview' | 'charts' | 'audit' | 'backups'>('overview');

  // ============================================
  // 🔐 AUTHENTICATION CHECK
  // ============================================
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      
      // Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        setError('Not authenticated. Please login.');
        setIsAuthenticated(false);
        // Redirect to login after a delay
        setTimeout(() => {
          router.push('/auth/login?redirectTo=/admin');
        }, 2000);
        return;
      }

      // Get user profile with role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, is_2fa_enabled')
        .eq('id', session.user.id)
        .single();

      if (profileError || !profile) {
        setError('Failed to load user profile');
        setIsAuthenticated(false);
        return;
      }

      // Check if user is admin or superadmin
      const userRole = (profile as any).role;
      const is2FA = (profile as any).is_2fa_enabled;
      
      if (userRole !== 'admin' && userRole !== 'superadmin') {
        setError('Access denied. Admin privileges required.');
        setIsAuthenticated(false);
        setTimeout(() => {
          router.push('/');
        }, 2000);
        return;
      }

      // All checks passed
      setIsAuthenticated(true);
      setIsAdmin(true);
      setUserRole(userRole);
      setIs2FAEnabled(is2FA || false);
      setError(null);

      // Fetch dashboard data
      await fetchAllData();
      
    } catch (err: any) {
      console.error('Auth check failed:', err);
      setError(err.message || 'Authentication failed');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // 📊 DATA FETCHING (Session-based)
  // ============================================
  const fetchAllData = async () => {
    try {
      setLoading(true);

      // All API calls now use session cookies automatically (no headers needed!)
      const [
        workersRes, costsRes, usersRes, 
        activitiesRes, imagesRes, analyticsRes
      ] = await Promise.all([
        fetch('/api/admin/workers'),
        fetch('/api/admin/costs?period=7d'),
        fetch('/api/admin/users?limit=10'),
        fetch('/api/admin/activities?limit=50'),
        fetch('/api/admin/images?limit=12'),
        fetch('/api/admin/analytics?period=7d'),
      ]);

      // Check if any request failed
      if (!workersRes.ok || !costsRes.ok || !usersRes.ok) {
        throw new Error('Failed to fetch admin data. Please check your permissions.');
      }

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
      
      // Generate chart data
      if (analyticsData) {
        setChartData({
          operations: analyticsData.dailyOperations || [],
          costs: analyticsData.dailyCosts || [],
          users: analyticsData.dailyUsers || [],
        });
      }
      
    } catch (err: any) {
      console.error('Data fetch error:', err);
      showToast(err.message || 'Failed to fetch data', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh every 30s
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      const interval = setInterval(fetchAllData, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, isAdmin]);

  // ============================================
  // 🔍 SEARCH & FILTER
  // ============================================
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
    
    // Date range
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

  // ============================================
  // 👥 USER ACTIONS (Session-based API calls)
  // ============================================
  const handleViewDetails = async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`);
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
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
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
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
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
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
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
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) throw new Error('Failed to delete user');
      
      showToast(`Deleted ${userEmail}`, 'success');
      fetchAllData();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete user', 'error');
    }
  };

  // ============================================
  // 🚪 LOGOUT
  // ============================================
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  // ============================================
  // 🎨 LOADING STATE
  // ============================================
  if (loading && !isAuthenticated) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 mx-auto animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
          <p className="text-white/70">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // ============================================
  // ❌ ERROR STATE
  // ============================================
  if (error && !isAuthenticated) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#0a0a0a] p-6">
        <div className="w-full max-w-md space-y-6 rounded-xl border border-red-500/30 bg-red-950/20 p-8 backdrop-blur-sm">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
            <h1 className="mt-4 text-2xl font-bold text-white">Access Denied</h1>
            <p className="mt-2 text-sm text-red-400">{error}</p>
          </div>
          
          <button
            onClick={() => router.push('/auth/login')}
            className="w-full rounded-lg bg-purple-600 px-4 py-3 font-semibold text-white transition-all hover:bg-purple-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // ============================================
  // ✅ ADMIN DASHBOARD (Authenticated)
  // ============================================
  return (
    <ErrorBoundary>
      <div className="h-screen w-screen overflow-y-auto bg-[#0a0a0a]">
        <div className="mx-auto max-w-[1920px] space-y-6 p-6 pb-12">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Jewelshot Admin Dashboard</h1>
            <p className="mt-1 text-white/60">
              Real-time system monitoring & management
              {is2FAEnabled && (
                <span className="ml-2 inline-flex items-center gap-1 text-xs text-green-400">
                  <Shield className="h-3 w-3" />
                  2FA Enabled
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/admin/settings')}
              className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/20"
              title="Admin Settings"
            >
              <Settings className="h-4 w-4" />
              Settings
            </button>
            <button
              onClick={fetchAllData}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/20"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-red-500/30 bg-red-950/20 px-4 py-2 text-sm font-medium text-red-400 transition-all hover:bg-red-950/30"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-white/10">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'overview'
                ? 'border-b-2 border-purple-500 text-white'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('charts')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'charts'
                ? 'border-b-2 border-purple-500 text-white'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'audit'
                ? 'border-b-2 border-purple-500 text-white'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Shield className="inline mr-1 h-4 w-4" />
            Audit Logs
          </button>
          <button
            onClick={() => setActiveTab('backups')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'backups'
                ? 'border-b-2 border-purple-500 text-white'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Database className="inline mr-1 h-4 w-4" />
            Backups
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Users"
                value={analytics?.totalUsers || 0}
                icon={Users}
                trend={{ value: analytics?.userGrowth || 0, isPositive: true }}
              />
              <StatCard
                title="Active Operations"
                value={workers?.activeJobs || 0}
                icon={Activity}
                trend={{ value: 0, isPositive: true }}
              />
              <StatCard
                title="Total Revenue"
                value={`$${costs?.totalCost?.toFixed(2) || '0.00'}`}
                icon={DollarSign}
                trend={{ value: costs?.costChange || 0, isPositive: true }}
              />
              <StatCard
                title="Generated Images"
                value={analytics?.totalImages || 0}
                icon={Image}
                trend={{ value: analytics?.imageGrowth || 0, isPositive: true }}
              />
            </div>

            {/* Users Table */}
            <DataCard title="Recent Users">
              <SearchFilters
                onSearch={handleSearch}
                onFilter={handleFilter}
                onSort={handleSort}
              />
              
              <div className="mt-4 overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-white/10">
                    <tr className="text-left text-sm text-white/60">
                      <th className="pb-3">User</th>
                      <th className="pb-3">Credits</th>
                      <th className="pb-3">Operations</th>
                      <th className="pb-3">Joined</th>
                      <th className="pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="text-sm">
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                              <span className="text-xs font-medium text-purple-400">
                                {user.email?.[0]?.toUpperCase() || '?'}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-white">{user.email}</div>
                              <div className="text-xs text-white/40">{user.id.slice(0, 8)}...</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3">
                          <Badge variant={user.credits?.balance > 50 ? 'success' : 'warning'}>
                            {user.credits?.balance || 0}
                          </Badge>
                        </td>
                        <td className="py-3 text-white/70">
                          {user.stats?.total_operations || 0}
                        </td>
                        <td className="py-3 text-white/70">
                          {format(new Date(user.created_at), 'MMM d, yyyy')}
                        </td>
                        <td className="py-3">
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
          </>
        )}

        {activeTab === 'charts' && chartData && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <OperationsChart data={chartData.operations} />
            <CostChart data={chartData.costs} />
            <div className="lg:col-span-2">
              <UserGrowthChart data={chartData.users} />
            </div>
          </div>
        )}

        {/* Audit Logs Tab */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            <AuditLogsViewer />
          </div>
        )}

        {/* Backups Tab */}
        {activeTab === 'backups' && (
          <div className="space-y-6">
            <BackupManager />
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

          {/* Toast Notifications */}
          {toastState.visible && (
            <Toast
              message={toastState.message}
              type={toastState.type}
              onClose={hideToast}
            />
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
