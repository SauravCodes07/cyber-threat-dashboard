import { motion } from 'framer-motion';
import { AlertOctagon, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { AnimatedCounter } from '../ui/AnimatedCounter';
import { SEVERITY_CONFIG } from '../../utils/constants';

const ICONS = {
  critical: AlertOctagon,
  high: AlertTriangle,
  medium: AlertCircle,
  low: Info,
};

export function ThreatSeverityCards({ counts, loading }) {
  const levels = ['critical', 'high', 'medium', 'low'];

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {levels.map((l) => (
          <div key={l} className="glass rounded-2xl p-5 h-28 animate-pulse bg-[#1a2744]/40" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {levels.map((level, i) => {
        const config = SEVERITY_CONFIG[level];
        const Icon = ICONS[level];
        return (
          <GlassCard key={level} delay={i * 0.05} className="relative overflow-hidden group">
            <div
              className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"
              style={{ backgroundColor: config.color }}
            />
            <motion.div
              className="flex items-start justify-between"
              whileHover={{ scale: 1.02 }}
            >
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                  {config.label}
                </p>
                <p className="text-3xl font-bold" style={{ color: config.color }}>
                  <AnimatedCounter value={counts[level] || 0} />
                </p>
              </div>
              <div
                className="p-2.5 rounded-xl"
                style={{ backgroundColor: config.bg }}
              >
                <Icon className="w-5 h-5" style={{ color: config.color }} />
              </div>
            </motion.div>
          </GlassCard>
        );
      })}
    </div>
  );
}
