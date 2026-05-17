import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { GlassCard } from '../ui/GlassCard';
import { ChartContainer } from '../ui/ChartContainer';
import { PieChart as PieIcon } from 'lucide-react';

const COLORS = ['#00f0ff', '#a855f7', '#00ff88', '#ff3366', '#fbbf24', '#f97316'];

export function ThreatSourceChart({ data, loading }) {
  const isEmpty = !data?.length;

  return (
    <GlassCard delay={0.15}>
      <div className="flex items-center gap-2 mb-4">
        <PieIcon className="w-4 h-4 text-[#a855f7]" />
        <h3 className="text-sm font-semibold text-white">Threat Source Distribution</h3>
      </div>

      <ChartContainer loading={loading} empty={isEmpty} emptyMessage="No threat distribution data">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
              animationBegin={200}
              animationDuration={900}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: '#0d1424',
                border: '1px solid #1a2744',
                borderRadius: 12,
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: 11 }}
              formatter={(value) => <span className="text-slate-400">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
    </GlassCard>
  );
}
