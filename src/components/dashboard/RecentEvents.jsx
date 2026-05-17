import { motion } from 'framer-motion';
import { Clock, Shield } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { SeverityBadge } from '../ui/Badge';
import { formatRelativeTime } from '../../utils/formatters';

export function RecentEvents({ threats, activityLogs, loading }) {
  const events = [
    ...threats.slice(0, 5).map((t) => ({
      id: t.id,
      message: t.title,
      type: 'threat',
      severity: t.severity,
      time: t.createdAt,
    })),
    ...activityLogs.slice(0, 3).map((l) => ({
      id: l.id,
      message: l.message,
      type: 'activity',
      severity: null,
      time: l.createdAt,
    })),
  ].slice(0, 8);

  return (
    <GlassCard delay={0.3}>
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-[#00f0ff]" />
        <h3 className="text-sm font-semibold text-white">Recent Security Events</h3>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 rounded-lg bg-[#1a2744]/40 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {events.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center gap-3 py-2 border-b border-[#1a2744]/50 last:border-0"
            >
              <div
                className={`p-1.5 rounded-lg ${
                  event.type === 'threat' ? 'bg-[#ff3366]/15' : 'bg-[#00f0ff]/10'
                }`}
              >
                <Shield
                  className="w-3.5 h-3.5"
                  style={{ color: event.type === 'threat' ? '#ff3366' : '#00f0ff' }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-300 truncate">{event.message}</p>
                <p className="text-[10px] text-slate-500">{formatRelativeTime(event.time)}</p>
              </div>
              {event.severity && <SeverityBadge severity={event.severity} />}
            </motion.div>
          ))}
        </div>
      )}
    </GlassCard>
  );
}
