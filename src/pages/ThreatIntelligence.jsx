import { motion } from 'framer-motion';
import { Filter, Link2 } from 'lucide-react';
import { useState } from 'react';
import { useThreatData } from '../hooks/useThreatData';
import { GlassCard } from '../components/ui/GlassCard';
import { SeverityBadge, StatusBadge } from '../components/ui/Badge';
import { formatRelativeTime } from '../utils/formatters';
import { THREAT_TYPES } from '../utils/constants';
import { EmptyState } from '../components/ui/EmptyState';
import { ShieldAlert } from 'lucide-react';

export default function ThreatIntelligence() {
  const { threats, correlations, loading } = useThreatData();
  const [filter, setFilter] = useState('all');

  const filtered =
    filter === 'all' ? threats : threats.filter((t) => t.threatType === filter);

  return (
    <div className="space-y-4 sm:space-y-6">
      {correlations.length > 0 && (
        <GlassCard className="border-[#ff3366]/30">
          <div className="flex items-center gap-2 mb-3">
            <Link2 className="w-4 h-4 text-[#ff3366]" />
            <h3 className="text-sm font-semibold text-[#ff3366]">Correlation Engine — Active Matches</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {correlations.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-xl bg-[#ff3366]/5 border border-[#ff3366]/20"
              >
                <p className="text-sm font-semibold text-white">{c.name}</p>
                <p className="text-xs text-slate-400 mt-1">{c.confidence}% confidence</p>
                <p className="text-xs text-[#00f0ff] mt-2">{c.action}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Filter className="w-4 h-4 text-slate-500" />
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            filter === 'all' ? 'bg-[#00f0ff]/20 text-[#00f0ff]' : 'text-slate-400 hover:text-white'
          }`}
        >
          All
        </button>
        {THREAT_TYPES.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setFilter(type)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === type ? 'bg-[#00f0ff]/20 text-[#00f0ff]' : 'text-slate-400 hover:text-white'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-24 rounded-2xl bg-[#1a2744]/40 animate-pulse" />
            ))
          : filtered.length === 0 ? (
              <EmptyState
                icon={ShieldAlert}
                title="No threats found"
                description={filter === 'all' ? 'Threat data will sync from Firestore.' : `No ${filter} threats in the current feed.`}
              />
            ) : (
              filtered.map((threat, i) => (
              <GlassCard key={threat.id} delay={i * 0.03} hover={false}>
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <SeverityBadge severity={threat.severity} />
                      <StatusBadge status={threat.status} />
                      <span className="text-xs text-[#a855f7] font-mono">{threat.threatType}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-white">{threat.title}</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      {threat.targetAsset} · {threat.source} · {threat.ip} · {threat.region}
                    </p>
                  </div>
                  <div className="text-right text-xs text-slate-500">
                    {formatRelativeTime(threat.createdAt)}
                  </div>
                </div>
              </GlassCard>
            ))
            )}
      </div>
    </div>
  );
}
