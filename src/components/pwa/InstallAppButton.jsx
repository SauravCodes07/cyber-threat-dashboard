import { motion } from 'framer-motion';
import { Download, Loader2, Check, Smartphone } from 'lucide-react';
import { usePwaInstallContext } from '../../context/PwaInstallContext';

export function InstallAppButton({ variant = 'default', className = '' }) {
  const { canInstall, isInstalled, isStandalone, installing, install, installError } =
    usePwaInstallContext();

  const isCompact = variant === 'compact';
  const isProfile = variant === 'profile';

  if (isInstalled || isStandalone) {
    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#00ff88]/10 border border-[#00ff88]/25 text-[#00ff88] text-xs font-medium ${className}`}
      >
        <Check className="w-3.5 h-3.5" />
        {isCompact ? 'Installed' : 'App Installed'}
      </div>
    );
  }

  return (
    <div className={className}>
      <motion.button
        type="button"
        onClick={install}
        disabled={installing}
        whileHover={{ scale: installing ? 1 : 1.02 }}
        whileTap={{ scale: installing ? 1 : 0.98 }}
        className={`group relative inline-flex items-center justify-center gap-2 overflow-hidden font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
          isProfile
            ? 'w-full px-5 py-3 rounded-xl text-sm'
            : isCompact
              ? 'px-2.5 py-2 rounded-xl text-xs'
              : 'px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm'
        }`}
        style={{
          background:
            'linear-gradient(135deg, rgba(0,240,255,0.12) 0%, rgba(168,85,247,0.12) 100%)',
          border: '1px solid rgba(0, 240, 255, 0.35)',
          boxShadow: '0 0 20px rgba(0, 240, 255, 0.12)',
        }}
        title={canInstall ? 'Install CyberSec app' : 'Install from browser menu'}
      >
        <span
          className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00f0ff]/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
          aria-hidden="true"
        />
        {installing ? (
          <Loader2 className="w-4 h-4 text-[#00f0ff] animate-spin relative z-10" />
        ) : (
          <Download className="w-4 h-4 text-[#00f0ff] relative z-10" />
        )}
        <span className="text-white relative z-10 whitespace-nowrap">
          {installing ? 'Installing...' : isCompact ? 'Install' : 'Install App'}
        </span>
      </motion.button>
      {installError && (
        <p className="text-[10px] text-[#fbbf24] mt-1.5 max-w-xs">{installError}</p>
      )}
    </div>
  );
}

export function PwaInstallCard() {
  const {
    canInstall,
    isInstalled,
    isStandalone,
    installing,
    installError,
    dismissError,
  } = usePwaInstallContext();

  if (isInstalled || isStandalone) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 p-4 rounded-2xl bg-[#00ff88]/5 border border-[#00ff88]/20"
      >
        <div className="p-3 rounded-xl bg-[#00ff88]/10">
          <Check className="w-6 h-6 text-[#00ff88]" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">CyberSec is installed</p>
          <p className="text-xs text-slate-400 mt-0.5">
            Running in standalone mode with offline app shell caching.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl border border-[#00f0ff]/25 p-5 sm:p-6"
      style={{
        background:
          'linear-gradient(135deg, rgba(0,240,255,0.08) 0%, rgba(168,85,247,0.06) 50%, rgba(5,8,16,0.9) 100%)',
      }}
    >
      <motion.div
        className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-[#00f0ff]/10 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ repeat: Infinity, duration: 4 }}
        aria-hidden="true"
      />
      <div className="relative flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-start gap-4 flex-1">
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            className="p-3 rounded-2xl bg-[#00f0ff]/10 border border-[#00f0ff]/20 shrink-0"
          >
            <Smartphone className="w-7 h-7 text-[#00f0ff]" />
          </motion.div>
          <div>
            <p className="text-xs text-[#00f0ff] uppercase tracking-wider font-semibold mb-1">
              Progressive Web App
            </p>
            <h3 className="text-base font-bold text-white">Install Cyber Threat Dashboard</h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed max-w-md">
              Add CyberSec to your home screen for instant SOC access, offline app shell, and a
              native standalone experience. Firebase auth stays fully online.
            </p>
          </div>
        </div>
        <InstallAppButton variant="profile" className="sm:shrink-0 w-full sm:w-auto" />
      </div>
      {installError && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative text-xs text-[#fbbf24] mt-3 flex items-center justify-between gap-2"
        >
          <span>{installError}</span>
          <button type="button" onClick={dismissError} className="text-slate-500 hover:text-white">
            Dismiss
          </button>
        </motion.p>
      )}
      {canInstall && !installing && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative text-[10px] text-[#00ff88] mt-3 flex items-center gap-1.5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse" />
          Install available — tap Install App or use the browser install icon in the address bar
        </motion.p>
      )}
    </motion.div>
  );
}
