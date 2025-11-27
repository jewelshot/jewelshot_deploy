/**
 * Cost Chart
 * 
 * Bar chart showing daily costs
 */

'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface CostChartProps {
  data: Array<{
    date: string;
    cost: number;
  }>;
}

export function CostChart({ data }: CostChartProps) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-6">
      <h3 className="mb-6 text-lg font-semibold text-white">Daily Costs</h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
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
            formatter={(value: number) => `$${value.toFixed(4)}`}
          />
          <Legend 
            wrapperStyle={{ color: '#fff' }}
          />
          <Bar 
            dataKey="cost" 
            fill="#f59e0b" 
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

