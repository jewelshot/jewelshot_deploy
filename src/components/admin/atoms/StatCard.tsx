/**
 * Stat Card Atom
 * Displays a single metric/statistic
 */

import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

const colorClasses = {
  blue: 'border-blue-500/30 bg-blue-950/20 text-blue-400',
  green: 'border-green-500/30 bg-green-950/20 text-green-400',
  purple: 'border-purple-500/30 bg-purple-950/20 text-purple-400',
  orange: 'border-orange-500/30 bg-orange-950/20 text-orange-400',
  red: 'border-red-500/30 bg-red-950/20 text-red-400',
};

export function StatCard({ title, value, icon: Icon, trend, color = 'purple' }: StatCardProps) {
  return (
    <div className={`rounded-xl border ${colorClasses[color]} p-6 backdrop-blur-sm transition-all hover:border-opacity-50`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="mt-2 text-3xl font-bold text-white">{value}</p>
          {trend && (
            <p className={`mt-2 text-sm ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        <div className="rounded-lg bg-white/10 p-3">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

