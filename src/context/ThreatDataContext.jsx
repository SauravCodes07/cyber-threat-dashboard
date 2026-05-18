/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo } from 'react';
import { useFirestoreCollection } from '../hooks/useFirestoreCollection';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { COLLECTIONS } from '../utils/constants';
import { calculateRiskScore, correlateEvents } from '../services/threatEngine';

const ThreatDataContext = createContext(null);

export function ThreatDataProvider({ children }) {
  const threats = useFirestoreCollection(COLLECTIONS.threats, { maxItems: 50 });
  const alerts = useFirestoreCollection(COLLECTIONS.alerts, { maxItems: 30 });
  const assets = useFirestoreCollection(COLLECTIONS.assets, { maxItems: 20 });
  const vulnerabilities = useFirestoreCollection(COLLECTIONS.vulnerabilities, {
    maxItems: 30,
    orderByField: 'discoveredAt',
  });
  const activityLogs = useFirestoreCollection(COLLECTIONS.activity_logs, { maxItems: 20 });

  const collectionErrors = [
    threats.error,
    alerts.error,
    assets.error,
    vulnerabilities.error,
    activityLogs.error,
  ].filter(Boolean);

  const firestoreError = collectionErrors[0] || null;
  const isOffline = !useOnlineStatus();

  const loading =
    threats.loading ||
    alerts.loading ||
    assets.loading ||
    vulnerabilities.loading;

  const value = useMemo(() => {
    const severityCounts = { critical: 0, high: 0, medium: 0, low: 0 };
    [...threats.data, ...alerts.data].forEach((item) => {
      const sev = (item.severity || 'low').toLowerCase();
      if (severityCounts[sev] !== undefined) severityCounts[sev]++;
    });

    const riskScore = calculateRiskScore({
      threats: threats.data,
      alerts: alerts.data,
      vulnerabilities: vulnerabilities.data,
    });

    const events = [
      ...threats.data.map((t) => ({ eventType: t.eventType })),
      ...alerts.data.map((a) => ({ eventType: a.eventType })),
    ];

    const dist = {};
    threats.data.forEach((t) => {
      const type = t.threatType || 'Unknown';
      dist[type] = (dist[type] || 0) + 1;
    });

    const regions = {};
    threats.data.forEach((t) => {
      const region = t.region || 'Unknown';
      regions[region] = (regions[region] || 0) + 1;
    });

    const hours = Array.from({ length: 12 }, (_, i) => ({
      time: `${11 - i}h ago`,
      threats: 0,
      alerts: 0,
    }));
    threats.data.forEach((t, i) => {
      hours[11 - (i % 12)].threats += 1;
    });
    alerts.data.forEach((a, i) => {
      hours[11 - ((i + 3) % 12)].alerts += 1;
    });

    return {
      threats: threats.data,
      alerts: alerts.data,
      assets: assets.data,
      vulnerabilities: vulnerabilities.data,
      activityLogs: activityLogs.data,
      loading,
      firestoreError,
      isOffline,
      severityCounts,
      riskScore,
      correlations: correlateEvents(events),
      threatTypeDistribution: Object.entries(dist).map(([name, value]) => ({ name, value })),
      regionHeatmap: Object.entries(regions).map(([name, count]) => ({ name, count })),
      topVulnerableAssets: [...assets.data]
        .sort((a, b) => (b.riskScore || 0) - (a.riskScore || 0))
        .slice(0, 6),
      timelineData: hours,
    };
  }, [
    threats.data,
    alerts.data,
    assets.data,
    vulnerabilities.data,
    activityLogs.data,
    loading,
    firestoreError,
    isOffline,
  ]);

  return (
    <ThreatDataContext.Provider value={value}>{children}</ThreatDataContext.Provider>
  );
}

export function useThreatData() {
  const ctx = useContext(ThreatDataContext);
  if (!ctx) {
    throw new Error('useThreatData must be used within ThreatDataProvider');
  }
  return ctx;
}
