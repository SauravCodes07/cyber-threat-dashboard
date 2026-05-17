import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  ShieldAlert,
  Globe,
  Bug,
  Bot,
  User,
  Shield,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserAvatar } from '../ui/UserAvatar';

const ICON_MAP = {
  LayoutDashboard,
  ShieldAlert,
  Globe,
  Bug,
  Bot,
  User,
};

const NAV = [
  { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/threats', label: 'Threat Intel', icon: 'ShieldAlert' },
  { path: '/attack-surface', label: 'Attack Surface', icon: 'Globe' },
  { path: '/vulnerabilities', label: 'Vulnerabilities', icon: 'Bug' },
  { path: '/ai-assistant', label: 'AI Assistant', icon: 'Bot' },
  { path: '/profile', label: 'Profile', icon: 'User' },
];

export function Sidebar({ mobileOpen, onClose }) {
  const { signOut, user } = useAuth();

  return (
    <>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ x: mobileOpen ? 0 : undefined }}
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 sm:w-72 flex flex-col glass-strong border-r border-[#1a2744] transition-transform duration-300 ease-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 sm:p-5 border-b border-[#1a2744]">
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <motion.div className="p-2 rounded-xl bg-[#00f0ff]/10 neon-glow-cyan">
              <Shield className="w-6 h-6 text-[#00f0ff]" />
            </motion.div>
            <div>
              <h1 className="text-sm font-bold text-gradient-cyber">ThreatIntel</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">SOC Platform</p>
            </div>
          </motion.div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV.map((item) => {
            const Icon = ICON_MAP[item.icon];
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/20 shadow-sm shadow-[#00f0ff]/5'
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isActive ? '' : 'group-hover:scale-110'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-[#00f0ff] shadow-[0_0_8px_#00f0ff]"
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-3 border-t border-[#1a2744]">
          <div className="flex items-center gap-3 px-2 py-2 mb-2">
            <UserAvatar user={user} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">
                {user?.displayName || 'Security Analyst'}
              </p>
              <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={signOut}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-[#ff3366] hover:bg-[#ff3366]/10 transition-colors active:scale-[0.98]"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </motion.aside>
    </>
  );
}
