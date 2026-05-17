import { GlassCard } from '../ui/GlassCard';
import { RiskMeter } from '../ui/RiskMeter';
import { Gauge } from 'lucide-react';
import { getRiskLevel } from '../../services/threatEngine';

export function RiskScoreWidget({ score, correlations, loading }) {
  const { level, color } = getRiskLevel(score);

  return (
    <GlassCard delay={0.1} className="flex flex-col items-center justify-center">
      <div className="flex items-center gap-2 mb-4 w-full">
        <Gauge className="w-4 h-4 text-[#00f0ff]" />
        <h3 className="text-sm font-semibold text-white">Risk Score Meter</h3>
      </div>

      {loading ? (
        <div className="w-40 h-40 rounded-full bg-[#1a2744]/40 animate-pulse" />
      ) : (
        <>
          <RiskMeter score={score} />
          <p className="text-xs text-slate-400 mt-4 text-center">
            Platform risk is <span style={{ color }} className="font-semibold">{level}</span>
          </p>
          {correlations.length > 0 && (
            <div className="mt-4 w-full p-3 rounded-xl bg-[#ff3366]/10 border border-[#ff3366]/20">
              <p className="text-[10px] text-[#ff3366] font-semibold uppercase tracking-wider mb-1">
                Correlation Detected
              </p>
              <p className="text-xs text-slate-300">{correlations[0].name}</p>
              <p className="text-[10px] text-slate-500 mt-1">{correlations[0].confidence}% confidence</p>
            </div>
          )}
        </>
      )}
    </GlassCard>
  );
}
