/**
 * Admin Announcements Page
 * 
 * Manage system announcements sent to users
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Eye, 
  EyeOff,
  Megaphone,
  Users,
  Clock,
  AlertCircle,
  Sparkles,
  Gift,
  Zap,
  Wrench,
  Send,
} from 'lucide-react';
import type { 
  Announcement, 
  AnnouncementType, 
  AnnouncementPriority, 
  TargetAudience,
  CreateAnnouncementPayload,
} from '@/lib/announcements/types';
import { 
  ANNOUNCEMENT_TYPE_CONFIG, 
  ANNOUNCEMENT_PRIORITY_CONFIG,
  TARGET_AUDIENCE_CONFIG,
} from '@/lib/announcements/types';

// Icon mapping
const TYPE_ICONS: Record<AnnouncementType, typeof Sparkles> = {
  update: Sparkles,
  offer: Gift,
  alert: AlertCircle,
  feature: Zap,
  maintenance: Wrench,
};

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateAnnouncementPayload>({
    title: '',
    message: '',
    type: 'update',
    priority: 'normal',
    target_audience: 'all',
  });

  const fetchAnnouncements = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/announcements');
      const data = await response.json();
      if (data.success) {
        setAnnouncements(data.announcements);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingId 
        ? `/api/admin/announcements/${editingId}`
        : '/api/admin/announcements';
      
      const response = await fetch(url, {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (data.success) {
        setShowForm(false);
        setEditingId(null);
        setFormData({
          title: '',
          message: '',
          type: 'update',
          priority: 'normal',
          target_audience: 'all',
        });
        fetchAnnouncements();
      }
    } catch (error) {
      console.error('Error saving announcement:', error);
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setFormData({
      title: announcement.title,
      message: announcement.message,
      type: announcement.type,
      priority: announcement.priority,
      target_audience: announcement.target_audience,
      action_url: announcement.action_url || undefined,
      action_label: announcement.action_label || undefined,
    });
    setEditingId(announcement.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    
    try {
      const response = await fetch(`/api/admin/announcements/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        fetchAnnouncements();
      }
    } catch (error) {
      console.error('Error deleting announcement:', error);
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      await fetch(`/api/admin/announcements/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentActive }),
      });
      fetchAnnouncements();
    } catch (error) {
      console.error('Error toggling announcement:', error);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-purple-500/20 p-3">
            <Megaphone className="h-6 w-6 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Announcements</h1>
            <p className="text-sm text-white/50">
              Send announcements to users
            </p>
          </div>
        </div>
        
        <button
          onClick={() => {
            setFormData({
              title: '',
              message: '',
              type: 'update',
              priority: 'normal',
              target_audience: 'all',
            });
            setEditingId(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-purple-500 px-4 py-2.5 font-medium text-white transition-colors hover:bg-purple-600"
        >
          <Plus className="h-5 w-5" />
          New Announcement
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-500/20 p-2">
              <Eye className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {announcements.filter(a => a.is_active).length}
              </p>
              <p className="text-sm text-white/50">Active</p>
            </div>
          </div>
        </div>
        
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-yellow-500/20 p-2">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {announcements.filter(a => a.priority !== 'normal').length}
              </p>
              <p className="text-sm text-white/50">Important</p>
            </div>
          </div>
        </div>
        
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-500/20 p-2">
              <Users className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {announcements.length}
              </p>
              <p className="text-sm text-white/50">Total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0a0a0a] p-6">
            <h2 className="mb-4 text-xl font-bold text-white">
              {editingId ? 'Edit Announcement' : 'New Announcement'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="mb-1 block text-sm text-white/70">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-white/30 focus:border-purple-500 focus:outline-none"
                  placeholder="Announcement title..."
                  required
                />
              </div>

              {/* Message */}
              <div>
                <label className="mb-1 block text-sm text-white/70">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="h-24 w-full resize-none rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-white/30 focus:border-purple-500 focus:outline-none"
                  placeholder="Write your announcement..."
                  required
                />
              </div>

              {/* Type & Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm text-white/70">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as AnnouncementType })}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-purple-500 focus:outline-none"
                  >
                    {Object.entries(ANNOUNCEMENT_TYPE_CONFIG).map(([key, config]) => (
                      <option key={key} value={key}>{config.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="mb-1 block text-sm text-white/70">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as AnnouncementPriority })}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-purple-500 focus:outline-none"
                  >
                    {Object.entries(ANNOUNCEMENT_PRIORITY_CONFIG).map(([key, config]) => (
                      <option key={key} value={key}>{config.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Target Audience */}
              <div>
                <label className="mb-1 block text-sm text-white/70">Target Audience</label>
                <select
                  value={formData.target_audience}
                  onChange={(e) => setFormData({ ...formData, target_audience: e.target.value as TargetAudience })}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-purple-500 focus:outline-none"
                >
                  {Object.entries(TARGET_AUDIENCE_CONFIG).map(([key, config]) => (
                    <option key={key} value={key}>{config.label}</option>
                  ))}
                </select>
              </div>

              {/* Action URL & Label */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm text-white/70">Action URL (optional)</label>
                  <input
                    type="text"
                    value={formData.action_url || ''}
                    onChange={(e) => setFormData({ ...formData, action_url: e.target.value || undefined })}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-white/30 focus:border-purple-500 focus:outline-none"
                    placeholder="/pricing or https://..."
                  />
                </div>
                
                <div>
                  <label className="mb-1 block text-sm text-white/70">Action Label (optional)</label>
                  <input
                    type="text"
                    value={formData.action_label || ''}
                    onChange={(e) => setFormData({ ...formData, action_label: e.target.value || undefined })}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-white/30 focus:border-purple-500 focus:outline-none"
                    placeholder="Learn More"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 rounded-lg border border-white/10 py-2.5 font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-purple-500 py-2.5 font-medium text-white transition-colors hover:bg-purple-600"
                >
                  <Send className="h-4 w-4" />
                  {editingId ? 'Update' : 'Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Announcements List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-8 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
          </div>
        ) : announcements.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-8 text-center">
            <Megaphone className="mx-auto mb-3 h-12 w-12 text-white/20" />
            <p className="text-white/50">No announcements yet</p>
            <p className="text-sm text-white/30">Create your first announcement to notify users</p>
          </div>
        ) : (
          announcements.map((announcement) => {
            const Icon = TYPE_ICONS[announcement.type] || Sparkles;
            const config = ANNOUNCEMENT_TYPE_CONFIG[announcement.type];
            
            return (
              <div
                key={announcement.id}
                className={`rounded-xl border bg-white/[0.02] p-4 transition-colors ${
                  announcement.is_active 
                    ? 'border-white/10' 
                    : 'border-white/5 opacity-50'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`shrink-0 rounded-lg p-2.5 ${config.bgColor}`}>
                    <Icon className={`h-5 w-5 ${config.color}`} />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-medium text-white">{announcement.title}</h3>
                        <p className="mt-1 text-sm text-white/50 line-clamp-2">
                          {announcement.message}
                        </p>
                      </div>
                      
                      {/* Badges */}
                      <div className="flex shrink-0 gap-2">
                        {announcement.priority !== 'normal' && (
                          <span className="rounded-full bg-yellow-500/20 px-2 py-0.5 text-xs font-medium text-yellow-400">
                            {announcement.priority}
                          </span>
                        )}
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${config.bgColor} ${config.color}`}>
                          {config.label}
                        </span>
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="mt-3 flex items-center gap-4 text-xs text-white/40">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {TARGET_AUDIENCE_CONFIG[announcement.target_audience].label}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(announcement.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 gap-1">
                    <button
                      onClick={() => handleToggleActive(announcement.id, announcement.is_active)}
                      className="rounded-lg p-2 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
                      title={announcement.is_active ? 'Deactivate' : 'Activate'}
                    >
                      {announcement.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => handleEdit(announcement)}
                      className="rounded-lg p-2 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(announcement.id)}
                      className="rounded-lg p-2 text-white/40 transition-colors hover:bg-red-500/20 hover:text-red-400"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
