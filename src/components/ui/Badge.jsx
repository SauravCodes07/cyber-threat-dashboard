import { SEVERITY_CONFIG } from '../../utils/constants';

export function SeverityBadge({ severity }) {
  const config = SEVERITY_CONFIG[severity?.toLowerCase()] || SEVERITY_CONFIG.low;
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide"
      style={{ color: config.color, backgroundColor: config.bg }}
    >
      {config.label}
    </span>
  );
}

export function StatusBadge({ status }) {
  const colors = {
    active: '#ff3366',
    open: '#ff3366',
    investigating: '#fbbf24',
    mitigated: '#00ff88',
    patched: '#00ff88',
    monitored: '#00f0ff',
    'at-risk': '#ff3366',
  };
  const color = colors[status?.toLowerCase()] || '#64748b';
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize"
      style={{ color, backgroundColor: `${color}20` }}
    >
      {status}
    </span>
  );
}
