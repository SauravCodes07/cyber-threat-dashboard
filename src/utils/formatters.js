export function formatRelativeTime(date) {
  if (!date) return '—';
  const d = date?.toDate ? date.toDate() : new Date(date);
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function formatTimestamp(date) {
  if (!date) return '—';
  const d = date?.toDate ? date.toDate() : new Date(date);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function truncate(str, len = 48) {
  if (!str || str.length <= len) return str || '';
  return `${str.slice(0, len)}…`;
}
