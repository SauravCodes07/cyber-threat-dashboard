import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Zap } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { SeverityBadge } from '../ui/Badge';
import { formatRelativeTime } from '../../utils/formatters';
import { EmptyState } from '../ui/EmptyState';

export function AlertsFeed({ alerts, loading }) {
  const openAlerts = alerts.filter((a) => a.status === 'open' || !a.status).slice(0, 8);
  return (
    <GlassCard delay={0.25} className="h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#ff3366]" />
          <h3 className="text-sm font-semibold text-white">Active Alerts</h3>
        </div>
        <span className="flex items-center gap-1 text-xs text-[#00ff88]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse" />
          Live
        </span>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-xl bg-[#1a2744]/40 animate-pulse" />
          ))}
        </div>
      ) : openAlerts.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No active alerts"
          description="All clear — no open alerts in the queue."
        />
      ) : (
        <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
          <AnimatePresence mode="popLayout">
            {openAlerts.map((alert, i) => (
                <motion.div
                  key={alert.id}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.04 }}
                  className="p-3 rounded-xl border border-[#1a2744] bg-[#0a0f1a]/60 hover:border-[#ff3366]/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-xs font-medium text-white leading-snug flex-1">
                      {alert.title}
                    </p>
                    <SeverityBadge severity={alert.severity} />
                  </div>
                  <p className="text-[10px] text-slate-500 mb-1">
                    {alert.targetAsset} · {formatRelativeTime(alert.createdAt)}
                  </p>
                  {alert.recommendedAction && (
                    <p className="text-[10px] text-[#00f0ff]/80 flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      {alert.recommendedAction}
                    </p>
                  )}
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      )}
    </GlassCard>
  );
}
