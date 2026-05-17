import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { MapPin } from 'lucide-react';

const REGION_POSITIONS = {
  'North America': { x: 22, y: 38 },
  Europe: { x: 48, y: 32 },
  'Asia Pacific': { x: 72, y: 42 },
  'South America': { x: 30, y: 68 },
  Africa: { x: 50, y: 58 },
  'Middle East': { x: 58, y: 48 },
};

export function GlobalHeatmap({ regions, loading }) {
  const maxCount = Math.max(...regions.map((r) => r.count), 1);

  return (
    <GlassCard className="h-full min-h-[280px]">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-4 h-4 text-[#00f0ff]" />
        <h3 className="text-sm font-semibold text-white">Global Threat Heatmap</h3>
      </div>

      {loading ? (
        <div className="h-48 rounded-xl bg-[#1a2744]/40 animate-pulse" />
      ) : (
        <div className="relative h-48 rounded-xl bg-[#0a0f1a] border border-[#1a2744] overflow-hidden grid-bg">
          <svg viewBox="0 0 100 80" className="absolute inset-0 w-full h-full opacity-20">
            <ellipse cx="50" cy="40" rx="45" ry="30" fill="none" stroke="#00f0ff" strokeWidth="0.3" />
          </svg>

          {regions.map((region, i) => {
            const pos = REGION_POSITIONS[region.name] || { x: 50, y: 50 };
            const intensity = region.count / maxCount;
            const size = 8 + intensity * 16;
            return (
              <motion.div
                key={region.name}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.08 }}
                className="absolute"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 + i * 0.3 }}
                  className="rounded-full"
                  style={{
                    width: size,
                    height: size,
                    backgroundColor: `rgba(255, 51, 102, ${0.3 + intensity * 0.6})`,
                    boxShadow: `0 0 ${size * 2}px rgba(255, 51, 102, ${intensity * 0.8})`,
                  }}
                />
                <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 text-[9px] text-slate-400 whitespace-nowrap">
                  {region.name}
                </span>
              </motion.div>
            );
          })}
        </div>
      )}

      <div className="flex flex-wrap gap-3 mt-4">
        {regions.slice(0, 4).map((r) => (
          <div key={r.name} className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-[#ff3366]" />
            {r.name}: <span className="text-white font-mono">{r.count}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
