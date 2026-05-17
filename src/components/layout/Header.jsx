import { Menu, Search, Radio } from 'lucide-react';
import { motion } from 'framer-motion';
import { InstallAppButton } from '../pwa/InstallAppButton';

export function Header({ title, subtitle, onMenuClick, riskScore }) {
  return (
    <header className="sticky top-0 z-30 glass-strong border-b border-[#1a2744] px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <InstallAppButton variant="compact" />
          <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0a0f1a] border border-[#1a2744]">
            <Search className="w-4 h-4 text-slate-500" />
            <input
              type="search"
              placeholder="Search threats, assets..."
              className="bg-transparent text-sm text-slate-300 placeholder:text-slate-600 outline-none w-48"
            />
          </div>

          {riskScore !== undefined && (
            <motion.div
              animate={{ boxShadow: ['0 0 0px rgba(0,240,255,0)', '0 0 20px rgba(0,240,255,0.2)', '0 0 0px rgba(0,240,255,0)'] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/20"
            >
              <Radio className="w-3.5 h-3.5 text-[#00f0ff]" />
              <span className="text-xs text-[#00f0ff] font-mono font-semibold">
                Risk: {riskScore}
              </span>
            </motion.div>
          )}
        </div>
      </div>
    </header>
  );
}
