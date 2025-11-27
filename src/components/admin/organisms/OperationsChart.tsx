/**
 * Operations Chart
 * 
 * Line chart showing daily operations over time
 */

'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface OperationsChartProps {
  data: Array<{
    date: string;
    operations: number;
    cost: number;
  }>;
}

export function OperationsChart({ data }: OperationsChartProps) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-6">
      <h3 className="mb-6 text-lg font-semibold text-white">Daily Operations</h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
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
          <Line 
            type="monotone" 
            dataKey="operations" 
            stroke="#8b5cf6" 
            strokeWidth={2}
            dot={{ fill: '#8b5cf6', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

