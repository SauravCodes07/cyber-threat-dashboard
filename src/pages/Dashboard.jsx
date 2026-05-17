import { useThreatData } from '../hooks/useThreatData';
import { ThreatSeverityCards } from '../components/dashboard/ThreatSeverityCards';
import { GlobalHeatmap } from '../components/dashboard/GlobalHeatmap';
import { AttackTimeline } from '../components/dashboard/AttackTimeline';
import { ThreatSourceChart } from '../components/dashboard/ThreatSourceChart';
import { VulnerableAssets } from '../components/dashboard/VulnerableAssets';
import { RiskScoreWidget } from '../components/dashboard/RiskScoreWidget';
import { AlertsFeed } from '../components/dashboard/AlertsFeed';
import { RecentEvents } from '../components/dashboard/RecentEvents';

export default function Dashboard() {
  const {
    threats,
    alerts,
    activityLogs,
    loading,
    severityCounts,
    riskScore,
    correlations,
    threatTypeDistribution,
    regionHeatmap,
    topVulnerableAssets,
    timelineData,
  } = useThreatData();

  return (
    <div className="space-y-4 sm:space-y-6">
      <ThreatSeverityCards counts={severityCounts} loading={loading} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlobalHeatmap regions={regionHeatmap} loading={loading} />
            <RiskScoreWidget score={riskScore} correlations={correlations} loading={loading} />
          </div>
          <AttackTimeline data={timelineData} loading={loading} />
        </div>
        <AlertsFeed alerts={alerts} loading={loading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ThreatSourceChart data={threatTypeDistribution} loading={loading} />
        <VulnerableAssets assets={topVulnerableAssets} loading={loading} />
        <RecentEvents threats={threats} activityLogs={activityLogs} loading={loading} />
      </div>
    </div>
  );
}
