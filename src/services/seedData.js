import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  limit,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../firebase/firestore';
import { COLLECTIONS, THREAT_TYPES } from '../utils/constants';

function randomIp() {
  return `${Math.floor(Math.random() * 200) + 10}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function isCollectionEmpty(name) {
  const snap = await getDocs(query(collection(db, name), limit(1)));
  return snap.empty;
}

export async function seedDatabase(userId) {
  const needsSeed = await isCollectionEmpty(COLLECTIONS.threats);
  if (!needsSeed) return false;

  const batch = writeBatch(db);
  const now = serverTimestamp();

  const assets = [
    { id: 'asset-1', name: 'server-1', type: 'Web Server', ip: '10.0.1.10', exposure: 'external', riskScore: 42 },
    { id: 'asset-2', name: 'server-2', type: 'Database', ip: '10.0.1.20', exposure: 'internal', riskScore: 28 },
    { id: 'asset-3', name: 'server-3', type: 'API Gateway', ip: '10.0.1.30', exposure: 'external', riskScore: 78 },
    { id: 'asset-4', name: 'server-4', type: 'Load Balancer', ip: '10.0.1.40', exposure: 'dmz', riskScore: 55 },
    { id: 'asset-5', name: 'workstation-12', type: 'Endpoint', ip: '10.0.2.50', exposure: 'internal', riskScore: 35 },
    { id: 'asset-6', name: 'cloud-storage-prod', type: 'S3 Bucket', ip: 'N/A', exposure: 'cloud', riskScore: 61 },
  ];

  assets.forEach((asset) => {
    batch.set(doc(db, COLLECTIONS.assets, asset.id), {
      ...asset,
      ownerId: userId,
      status: asset.riskScore >= 70 ? 'at-risk' : 'monitored',
      lastScanned: now,
      createdAt: now,
    });
  });

  const severities = ['critical', 'high', 'medium', 'low'];
  const regions = ['North America', 'Europe', 'Asia Pacific', 'South America', 'Middle East', 'Africa'];
  const sources = ['Firewall', 'IDS', 'EDR', 'SIEM', 'Cloud WAF', 'Email Gateway'];

  for (let i = 0; i < 24; i++) {
    const id = `threat-${i + 1}`;
    const severity = pick(severities);
    const asset = pick(assets);
    batch.set(doc(db, COLLECTIONS.threats, id), {
      title: `${pick(THREAT_TYPES)} detected on ${asset.name}`,
      threatType: pick(THREAT_TYPES),
      severity,
      source: pick(sources),
      targetAsset: asset.name,
      assetId: asset.id,
      ip: randomIp(),
      region: pick(regions),
      eventType: pick(['failed_login', 'suspicious_ip', 'malware_detected', 'traffic_spike', 'abnormal_location']),
      status: pick(['active', 'investigating', 'mitigated']),
      description: `Automated detection of suspicious activity targeting ${asset.name}`,
      ownerId: userId,
      createdAt: now,
    });
  }

  const alertTemplates = [
    { title: 'Multiple failed logins from suspicious IP', severity: 'critical', eventType: 'failed_login' },
    { title: 'Abnormal login location detected', severity: 'high', eventType: 'abnormal_location' },
    { title: 'Lateral movement attempt blocked', severity: 'critical', eventType: 'lateral_movement' },
    { title: 'DDoS traffic spike on edge', severity: 'high', eventType: 'traffic_spike' },
    { title: 'Phishing email quarantined', severity: 'medium', eventType: 'suspicious_email' },
    { title: 'Privilege escalation attempt', severity: 'critical', eventType: 'privilege_escalation' },
    { title: 'Ransomware signature match', severity: 'critical', eventType: 'malware_detected' },
    { title: 'Data exfiltration pattern detected', severity: 'high', eventType: 'data_exfiltration' },
  ];

  alertTemplates.forEach((alert, i) => {
    const asset = pick(assets);
    batch.set(doc(db, COLLECTIONS.alerts, `alert-${i + 1}`), {
      ...alert,
      assetId: asset.id,
      targetAsset: asset.name,
      source: pick(sources),
      status: 'open',
      recommendedAction: pick([
        'Block IP and force MFA',
        'Isolate host segment',
        'Rotate credentials immediately',
        'Enable enhanced logging',
      ]),
      ownerId: userId,
      createdAt: now,
    });
  });

  const cveList = [
    { cve: 'CVE-2024-21762', cvss: 9.8, title: 'FortiOS Out-of-bounds Write' },
    { cve: 'CVE-2024-3400', cvss: 10.0, title: 'PAN-OS Command Injection' },
    { cve: 'CVE-2023-4966', cvss: 9.4, title: 'Citrix Bleed Information Disclosure' },
    { cve: 'CVE-2024-3094', cvss: 10.0, title: 'XZ Utils Backdoor' },
    { cve: 'CVE-2024-21413', cvss: 9.8, title: 'Microsoft Outlook RCE' },
    { cve: 'CVE-2023-44487', cvss: 7.5, title: 'HTTP/2 Rapid Reset Attack' },
    { cve: 'CVE-2024-27198', cvss: 9.8, title: 'JetBrains TeamCity Auth Bypass' },
    { cve: 'CVE-2024-1086', cvss: 7.8, title: 'Linux Kernel Use-After-Free' },
  ];

  cveList.forEach((vuln, i) => {
    const asset = pick(assets);
    batch.set(doc(db, COLLECTIONS.vulnerabilities, `vuln-${i + 1}`), {
      ...vuln,
      assetId: asset.id,
      assetName: asset.name,
      severity: vuln.cvss >= 9 ? 'critical' : vuln.cvss >= 7 ? 'high' : 'medium',
      status: pick(['open', 'in-progress', 'patched']),
      patchAvailable: Math.random() > 0.2,
      ownerId: userId,
      discoveredAt: now,
    });
  });

  const activities = [
    'User signed in via Google OAuth',
    'Threat correlation engine executed',
    'Automated scan completed on server-3',
    'Firewall rule updated: block 185.x.x.x',
    'Vulnerability patch scheduled',
    'SIEM alert rule triggered',
    'Asset risk score recalculated',
    'Incident response playbook initiated',
  ];

  activities.forEach((message, i) => {
    batch.set(doc(db, COLLECTIONS.activity_logs, `log-${i + 1}`), {
      message,
      type: pick(['auth', 'scan', 'alert', 'config', 'incident']),
      userId,
      createdAt: now,
    });
  });

  await batch.commit();

  await setDoc(
    doc(db, COLLECTIONS.users, userId),
    {
      lastSeedAt: now,
      dashboardInitialized: true,
    },
    { merge: true }
  );

  return true;
}

export async function ensureUserProfile(user) {
  await setDoc(
    doc(db, COLLECTIONS.users, user.uid),
    {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      lastLogin: serverTimestamp(),
    },
    { merge: true }
  );
}
