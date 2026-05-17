import { THREAT_TYPES } from '../utils/constants';

const CORRELATION_RULES = [
  {
    id: 'credential-attack',
    name: 'Credential Attack',
    patterns: ['failed_login', 'suspicious_ip', 'abnormal_location'],
    severity: 'critical',
    action: 'Force password reset, enable MFA, block suspicious IP ranges',
  },
  {
    id: 'ransomware-precursor',
    name: 'Ransomware Precursor',
    patterns: ['lateral_movement', 'privilege_escalation', 'data_exfiltration'],
    severity: 'critical',
    action: 'Isolate affected hosts, snapshot volumes, engage IR team',
  },
  {
    id: 'phishing-campaign',
    name: 'Phishing Campaign',
    patterns: ['suspicious_email', 'credential_harvest', 'malicious_link'],
    severity: 'high',
    action: 'Quarantine emails, block sender domains, user awareness alert',
  },
  {
    id: 'ddos-attack',
    name: 'DDoS Attack',
    patterns: ['traffic_spike', 'syn_flood', 'geo_anomaly'],
    severity: 'high',
    action: 'Enable DDoS mitigation, rate-limit edge, scale CDN',
  },
];

export function correlateEvents(events) {
  const types = new Set(events.map((e) => e.eventType || e.type));
  const matched = [];

  for (const rule of CORRELATION_RULES) {
    const matchCount = rule.patterns.filter((p) => types.has(p)).length;
    if (matchCount >= 2) {
      matched.push({
        ...rule,
        confidence: Math.min(95, 60 + matchCount * 15),
        matchedPatterns: rule.patterns.filter((p) => types.has(p)),
      });
    }
  }

  return matched;
}

export function calculateRiskScore({ threats = [], alerts = [], vulnerabilities = [] }) {
  const weights = { critical: 25, high: 15, medium: 8, low: 3 };
  let score = 0;

  [...threats, ...alerts].forEach((item) => {
    const sev = (item.severity || 'low').toLowerCase();
    score += weights[sev] || 3;
  });

  vulnerabilities.forEach((v) => {
    score += (v.cvss || 5) * 2;
  });

  return Math.min(100, Math.round(score));
}

export function getRiskLevel(score) {
  if (score >= 80) return { level: 'Critical', color: '#ff3366' };
  if (score >= 60) return { level: 'High', color: '#f97316' };
  if (score >= 35) return { level: 'Medium', color: '#fbbf24' };
  return { level: 'Low', color: '#00ff88' };
}

export function generateSimulatedEvent() {
  const eventTypes = [
    'failed_login',
    'suspicious_ip',
    'abnormal_location',
    'malware_detected',
    'traffic_spike',
    'privilege_escalation',
    'data_exfiltration',
    'lateral_movement',
  ];
  const severities = ['critical', 'high', 'medium', 'low'];
  const sources = ['Firewall', 'IDS', 'EDR', 'SIEM', 'Cloud WAF', 'Email Gateway'];

  return {
    eventType: eventTypes[Math.floor(Math.random() * eventTypes.length)],
    threatType: THREAT_TYPES[Math.floor(Math.random() * THREAT_TYPES.length)],
    severity: severities[Math.floor(Math.random() * severities.length)],
    source: sources[Math.floor(Math.random() * sources.length)],
    ip: `${Math.floor(Math.random() * 223) + 1}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    region: ['NA', 'EU', 'APAC', 'SA', 'MEA'][Math.floor(Math.random() * 5)],
  };
}

export function analyzeAssetRisk(asset, threats, vulnerabilities, alerts) {
  const assetThreats = threats.filter(
    (t) => t.targetAsset === asset.name || t.assetId === asset.id
  );
  const assetVulns = vulnerabilities.filter((v) => v.assetId === asset.id);
  const assetAlerts = alerts.filter((a) => a.assetId === asset.id);

  const score = calculateRiskScore({
    threats: assetThreats,
    alerts: assetAlerts,
    vulnerabilities: assetVulns,
  });

  const correlations = correlateEvents([
    ...assetThreats.map((t) => ({ eventType: t.eventType || 'malware_detected' })),
    ...assetAlerts.map((a) => ({ eventType: a.eventType || 'failed_login' })),
  ]);

  return {
    asset: asset.name,
    riskScore: score,
    riskLevel: getRiskLevel(score),
    threatCount: assetThreats.length,
    vulnCount: assetVulns.length,
    correlations,
    topThreats: assetThreats.slice(0, 3),
    remediation:
      score >= 70
        ? 'Immediate isolation recommended. Patch critical CVEs, rotate credentials, enable enhanced monitoring.'
        : score >= 40
          ? 'Schedule maintenance window for patching. Review access logs and tighten firewall rules.'
          : 'Continue standard monitoring. No immediate action required.',
  };
}
