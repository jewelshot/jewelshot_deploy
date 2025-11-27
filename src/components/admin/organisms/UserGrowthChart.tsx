/**
 * User Growth Chart
 * 
 * Area chart showing user growth over time
 */

'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface UserGrowthChartProps {
  data: Array<{
    date: string;
    users: number;
  }>;
}

export function UserGrowthChart({ data }: UserGrowthChartProps) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-6">
      <h3 className="mb-6 text-lg font-semibold text-white">User Growth</h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
          <XAxis 
            dataKey="date" 
            stroke="#ffffff60"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#ffffff60"
            style={{ fontSize: '12px' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#1a1a1a',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              color: '#fff',
            }}
          />
          <Legend 
            wrapperStyle={{ color: '#fff' }}
          />
          <Area 
            type="monotone" 
            dataKey="users" 
            stroke="#10b981" 
            strokeWidth={2}
            fill="url(#colorUsers)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

