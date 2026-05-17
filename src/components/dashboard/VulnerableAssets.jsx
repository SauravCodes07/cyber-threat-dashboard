import { motion } from 'framer-motion';
import { Server, ChevronRight } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { StatusBadge } from '../ui/Badge';

export function VulnerableAssets({ assets, loading }) {
  return (
    <GlassCard delay={0.2}>
      <div className="flex items-center gap-2 mb-4">
        <Server className="w-4 h-4 text-[#ff3366]" />
        <h3 className="text-sm font-semibold text-white">Top Vulnerable Assets</h3>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 rounded-xl bg-[#1a2744]/40 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {assets.map((asset, i) => (
            <motion.div
              key={asset.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-[#0a0f1a]/80 border border-[#1a2744] hover:border-[#00f0ff]/20 transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{asset.name}</p>
                <p className="text-xs text-slate-500">{asset.type} · {asset.exposure}</p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={asset.status} />
                <div className="text-right">
                  <p
                    className="text-sm font-bold font-mono"
                    style={{
                      color:
                        asset.riskScore >= 70
                          ? '#ff3366'
                          : asset.riskScore >= 40
                            ? '#fbbf24'
                            : '#00ff88',
                    }}
                  >
                    {asset.riskScore}
                  </p>
                  <p className="text-[10px] text-slate-500">risk</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-[#00f0ff] transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </GlassCard>
  );
}
