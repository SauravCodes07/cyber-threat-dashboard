import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { PageTransition } from '../ui/PageTransition';
import { StatusBanner } from '../ui/StatusBanner';
import { useThreatData } from '../../hooks/useThreatData';

const PAGE_META = {
  '/dashboard': { title: 'Security Dashboard', subtitle: 'Real-time threat intelligence overview' },
  '/threats': { title: 'Threat Intelligence', subtitle: 'Active threats and correlation analysis' },
  '/attack-surface': { title: 'Attack Surface', subtitle: 'External exposure and asset mapping' },
  '/vulnerabilities': { title: 'Vulnerability Analysis', subtitle: 'CVE tracking and patch management' },
  '/ai-assistant': { title: 'AI Security Assistant', subtitle: 'Intelligent threat analysis and remediation' },
  '/profile': { title: 'Profile & Settings', subtitle: 'Account and platform configuration' },
};

export function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { riskScore, isOffline, firestoreError } = useThreatData();
  const meta = PAGE_META[location.pathname] || { title: 'ThreatIntel', subtitle: '' };

  return (
    <div className="flex min-h-screen bg-[#050810]">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 lg:pl-0">
        <StatusBanner isOffline={isOffline} firestoreError={firestoreError} />
        <Header
          title={meta.title}
          subtitle={meta.subtitle}
          onMenuClick={() => setMobileOpen(true)}
          riskScore={riskScore}
        />

        <main className="flex-1 p-3 sm:p-4 lg:p-6 xl:p-8 overflow-auto grid-bg">
          <div className="page-container">
            <AnimatePresence mode="wait">
              <PageTransition key={location.pathname}>
                <Outlet />
              </PageTransition>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
