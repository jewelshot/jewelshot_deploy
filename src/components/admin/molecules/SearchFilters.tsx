/**
 * Search & Filters Component
 * 
 * Search users and filter/sort results
 */

'use client';

import { Search, Filter, X } from 'lucide-react';
import { useState } from 'react';

interface SearchFiltersProps {
  onSearch: (query: string) => void;
  onFilter: (filters: FilterOptions) => void;
  onSort: (sortBy: SortOption) => void;
}

export interface FilterOptions {
  creditRange?: 'all' | '0-10' | '10-50' | '50+';
  status?: 'all' | 'active' | 'banned' | 'suspicious';
  dateRange?: '1d' | '7d' | '30d' | 'all';
}

export type SortOption = 'created_desc' | 'created_asc' | 'operations_desc' | 'credits_desc';

export function SearchFilters({ onSearch, onFilter, onSort }: SearchFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    creditRange: 'all',
    status: 'all',
    dateRange: 'all',
  });
  const [sortBy, setSortBy] = useState<SortOption>('created_desc');

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleSortChange = (value: SortOption) => {
    setSortBy(value);
    onSort(value);
  };

  const clearFilters = () => {
    const defaultFilters: FilterOptions = { 
      creditRange: 'all', 
      status: 'all', 
      dateRange: 'all' 
    };
    setFilters(defaultFilters);
    setSearchQuery('');
    setSortBy('created_desc');
    onFilter(defaultFilters);
    onSearch('');
    onSort('created_desc');
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search by email or user ID..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full rounded-lg border border-white/20 bg-white/10 py-3 pl-10 pr-4 text-white placeholder-white/40 focus:border-purple-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 rounded-lg border px-4 py-3 font-medium transition-all ${
            showFilters
              ? 'border-purple-500 bg-purple-600/20 text-purple-400'
              : 'border-white/20 bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          <Filter className="h-5 w-5" />
          Filters
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="grid grid-cols-1 gap-4 rounded-lg border border-white/10 bg-white/5 p-4 md:grid-cols-4">
          
          {/* Credit Range */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white/60">Credits</label>
            <select
              value={filters.creditRange}
              onChange={(e) => handleFilterChange('creditRange', e.target.value)}
              className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
            >
              <option value="all">All Users</option>
              <option value="0-10">0-10 Credits</option>
              <option value="10-50">10-50 Credits</option>
              <option value="50+">50+ Credits</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white/60">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="banned">Banned</option>
              <option value="suspicious">Suspicious</option>
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white/60">Joined</label>
            <select
              value={filters.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
            >
              <option value="all">All Time</option>
              <option value="1d">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white/60">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value as SortOption)}
              className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
            >
              <option value="created_desc">Newest First</option>
              <option value="created_asc">Oldest First</option>
              <option value="operations_desc">Most Active</option>
              <option value="credits_desc">Highest Credits</option>
            </select>
          </div>

          {/* Clear Filters */}
          <div className="md:col-span-4">
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
            >
              <X className="h-4 w-4" />
              Clear all filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

