export const THREAT_TYPES = [
  'Malware',
  'DDoS',
  'Phishing',
  'Credential Attack',
  'Insider Threat',
  'Ransomware',
];

export const SEVERITY_LEVELS = ['critical', 'high', 'medium', 'low'];

export const SEVERITY_CONFIG = {
  critical: { label: 'Critical', color: '#ff3366', bg: 'rgba(255,51,102,0.15)' },
  high: { label: 'High', color: '#f97316', bg: 'rgba(249,115,22,0.15)' },
  medium: { label: 'Medium', color: '#fbbf24', bg: 'rgba(251,191,36,0.15)' },
  low: { label: 'Low', color: '#00ff88', bg: 'rgba(0,255,136,0.15)' },
};

export const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/threats', label: 'Threat Intel', icon: 'ShieldAlert' },
  { path: '/attack-surface', label: 'Attack Surface', icon: 'Globe' },
  { path: '/vulnerabilities', label: 'Vulnerabilities', icon: 'Bug' },
  { path: '/ai-assistant', label: 'AI Assistant', icon: 'Bot' },
  { path: '/profile', label: 'Profile', icon: 'User' },
];

export const COLLECTIONS = {
  users: 'users',
  threats: 'threats',
  alerts: 'alerts',
  assets: 'assets',
  vulnerabilities: 'vulnerabilities',
  activity_logs: 'activity_logs',
};

export const HEATMAP_REGIONS = [
  { id: 'na', name: 'North America', lat: 40, lng: -100, threats: 0 },
  { id: 'eu', name: 'Europe', lat: 50, lng: 10, threats: 0 },
  { id: 'asia', name: 'Asia Pacific', lat: 35, lng: 105, threats: 0 },
  { id: 'sa', name: 'South America', lat: -15, lng: -60, threats: 0 },
  { id: 'africa', name: 'Africa', lat: 0, lng: 20, threats: 0 },
  { id: 'me', name: 'Middle East', lat: 25, lng: 45, threats: 0 },
];
