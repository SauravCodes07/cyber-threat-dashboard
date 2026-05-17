import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { GlassCard } from '../ui/GlassCard';
import { ChartContainer } from '../ui/ChartContainer';
import { Activity } from 'lucide-react';

export function AttackTimeline({ data, loading }) {
  const isEmpty = !data?.length || data.every((d) => !d.threats && !d.alerts);

  return (
    <GlassCard delay={0.1}>
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-4 h-4 text-[#00f0ff]" />
        <h3 className="text-sm font-semibold text-white">Attack Timeline</h3>
      </div>

      <ChartContainer loading={loading} empty={isEmpty} emptyMessage="No timeline events yet">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="threatGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00f0ff" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#00f0ff" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="alertGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff3366" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#ff3366" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" />
            <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} />
            <Tooltip
              contentStyle={{
                background: '#0d1424',
                border: '1px solid #1a2744',
                borderRadius: 12,
                fontSize: 12,
              }}
            />
            <Area
              type="monotone"
              dataKey="threats"
              stroke="#00f0ff"
              fill="url(#threatGrad)"
              strokeWidth={2}
              animationDuration={800}
            />
            <Area
              type="monotone"
              dataKey="alerts"
              stroke="#ff3366"
              fill="url(#alertGrad)"
              strokeWidth={2}
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </GlassCard>
  );
}
