import { motion } from 'framer-motion';
import { Globe, ExternalLink, Lock, Cloud } from 'lucide-react';
import { useThreatData } from '../hooks/useThreatData';
import { GlassCard } from '../components/ui/GlassCard';
import { StatusBadge } from '../components/ui/Badge';
import { AnimatedCounter } from '../components/ui/AnimatedCounter';
import { ReportExportBar } from '../components/reports/DownloadSecurityReport';

const EXPOSURE_ICONS = {
  external: ExternalLink,
  internal: Lock,
  dmz: Globe,
  cloud: Cloud,
};

export default function AttackSurface() {
  const { assets, threats, loading } = useThreatData();

  const exposureStats = assets.reduce((acc, a) => {
    acc[a.exposure] = (acc[a.exposure] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-4 sm:space-y-6">
      <ReportExportBar subtitle="Export attack surface analysis and asset risk posture." />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(exposureStats).map(([exposure, count], i) => {
          const Icon = EXPOSURE_ICONS[exposure] || Globe;
          return (
            <GlassCard key={exposure} delay={i * 0.05}>
              <Icon className="w-5 h-5 text-[#00f0ff] mb-2" />
              <p className="text-xs text-slate-500 uppercase">{exposure}</p>
              <p className="text-2xl font-bold text-white">
                <AnimatedCounter value={count} />
              </p>
            </GlassCard>
          );
        })}
        <GlassCard delay={0.2}>
          <Globe className="w-5 h-5 text-[#ff3366] mb-2" />
          <p className="text-xs text-slate-500 uppercase">Total Assets</p>
          <p className="text-2xl font-bold text-white">
            <AnimatedCounter value={assets.length} />
          </p>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="text-sm font-semibold text-white mb-4">Asset Exposure Map</h3>
          {loading ? (
            <div className="h-64 rounded-xl bg-[#1a2744]/40 animate-pulse" />
          ) : (
            <div className="relative h-64 rounded-xl bg-[#0a0f1a] border border-[#1a2744] grid-bg p-6">
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                  className="w-32 h-32 rounded-full border-2 border-[#00f0ff]/30 flex items-center justify-center"
                >
                  <span className="text-xs text-[#00f0ff]">Core Network</span>
                </motion.div>
              </div>
              {assets.map((asset, i) => {
                const angle = (i / assets.length) * 2 * Math.PI;
                const x = 50 + Math.cos(angle) * 35;
                const y = 50 + Math.sin(angle) * 35;
                const threatCount = threats.filter((t) => t.assetId === asset.id).length;
                return (
                  <motion.div
                    key={asset.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="absolute"
                    style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
                  >
                    <motion.div
                      className={`px-2 py-1 rounded-lg text-[10px] font-mono border ${
                        asset.riskScore >= 70
                          ? 'border-[#ff3366]/50 bg-[#ff3366]/20 text-[#ff3366]'
                          : 'border-[#00f0ff]/30 bg-[#00f0ff]/10 text-[#00f0ff]'
                      }`}
                      whileHover={{ scale: 1.1 }}
                    >
                      {asset.name}
                      {threatCount > 0 && (
                        <span className="ml-1 text-[#ff3366]">({threatCount})</span>
                      )}
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </GlassCard>

        <GlassCard>
          <h3 className="text-sm font-semibold text-white mb-4">Asset Inventory</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {assets.map((asset, i) => {
              const Icon = EXPOSURE_ICONS[asset.exposure] || Globe;
              return (
                <motion.div
                  key={asset.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[#0a0f1a]/80 border border-[#1a2744]"
                >
                  <Icon className="w-4 h-4 text-slate-500" />
                  <div className="flex-1">
                    <p className="text-sm text-white font-medium">{asset.name}</p>
                    <p className="text-xs text-slate-500">{asset.type} · {asset.ip}</p>
                  </div>
                  <StatusBadge status={asset.status} />
                  <span
                    className="text-sm font-mono font-bold"
                    style={{
                      color: asset.riskScore >= 70 ? '#ff3366' : '#00ff88',
                    }}
                  >
                    {asset.riskScore}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
