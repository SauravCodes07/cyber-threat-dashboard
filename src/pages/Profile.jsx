import { Mail, Shield, Bell, Moon, Database } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GlassCard } from '../components/ui/GlassCard';
import { UserAvatar } from '../components/ui/UserAvatar';
import { useThreatData } from '../hooks/useThreatData';
import { PwaInstallCard } from '../components/pwa/InstallAppButton';

export default function Profile() {
  const { user, signOut } = useAuth();
  const { threats, alerts, assets, vulnerabilities } = useThreatData();

  const stats = [
    { label: 'Tracked Threats', value: threats.length, icon: Shield },
    { label: 'Active Alerts', value: alerts.filter((a) => a.status === 'open').length, icon: Bell },
    { label: 'Monitored Assets', value: assets.length, icon: Database },
    {
      label: 'Open CVEs',
      value: vulnerabilities.filter((v) => v.status === 'open').length,
      icon: Shield,
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
      <GlassCard>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <UserAvatar user={user} size="lg" rounded="xl" />
          <div className="text-center sm:text-left flex-1 min-w-0">
            <h2 className="text-xl font-bold text-white truncate">
              {user?.displayName || 'Security Analyst'}
            </h2>
            <p className="text-sm text-slate-400 flex items-center justify-center sm:justify-start gap-2 mt-1 truncate">
              <Mail className="w-4 h-4 shrink-0" />
              <span className="truncate">{user?.email}</span>
            </p>
            <p className="text-xs text-[#00ff88] mt-2 flex items-center justify-center sm:justify-start gap-1">
              <Shield className="w-3 h-3 shrink-0" />
              Google OAuth · Session Active
            </p>
          </div>
        </div>
      </GlassCard>

      <PwaInstallCard />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <GlassCard key={stat.label} delay={i * 0.05}>
              <Icon className="w-4 h-4 text-[#00f0ff] mb-2" />
              <p className="text-xl sm:text-2xl font-bold text-white font-mono">{stat.value}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider leading-tight">
                {stat.label}
              </p>
            </GlassCard>
          );
        })}
      </div>

      <GlassCard>
        <h3 className="text-sm font-semibold text-white mb-4">Platform Settings</h3>
        <div className="space-y-3">
          {[
            { icon: Bell, label: 'Real-time alert notifications', enabled: true },
            { icon: Moon, label: 'Dark cyber theme', enabled: true },
            { icon: Database, label: 'Firestore live sync', enabled: true },
          ].map((setting) => {
            const Icon = setting.icon;
            return (
              <div
                key={setting.label}
                className="flex items-center justify-between p-3 rounded-xl bg-[#0a0f1a]/80 border border-[#1a2744]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className="w-4 h-4 text-slate-500 shrink-0" />
                  <span className="text-sm text-slate-300 truncate">{setting.label}</span>
                </div>
                <div
                  className={`w-10 h-5 rounded-full relative shrink-0 transition-colors ${
                    setting.enabled ? 'bg-[#00f0ff]/30' : 'bg-[#1a2744]'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-[#00f0ff] transition-all ${
                      setting.enabled ? 'left-5' : 'left-0.5'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>

      <button
        type="button"
        onClick={signOut}
        className="w-full py-3 rounded-xl border border-[#ff3366]/30 text-[#ff3366] text-sm font-medium hover:bg-[#ff3366]/10 transition-colors active:scale-[0.99]"
      >
        Sign out of ThreatIntel
      </button>
    </div>
  );
}
