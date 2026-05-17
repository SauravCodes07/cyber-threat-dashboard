import { motion } from 'framer-motion';
import { Shield, RefreshCw, WifiOff, Database, AlertTriangle } from 'lucide-react';

const VARIANTS = {
  network: {
    icon: WifiOff,
    color: '#fbbf24',
    title: 'Connection Lost',
    defaultMessage: 'Unable to reach the network. Check your connection and try again.',
  },
  firebase: {
    icon: Database,
    color: '#00f0ff',
    title: 'Firebase Unavailable',
    defaultMessage: 'Could not connect to Firestore. Data may be stale until connection restores.',
  },
  auth: {
    icon: Shield,
    color: '#a855f7',
    title: 'Authentication Error',
    defaultMessage: 'Sign-in could not be completed. Please try again.',
  },
  config: {
    icon: AlertTriangle,
    color: '#ff3366',
    title: 'Configuration Missing',
    defaultMessage: 'Firebase environment variables are not set. Add VITE_FIREBASE_* to your .env file.',
  },
  error: {
    icon: AlertTriangle,
    color: '#ff3366',
    title: 'System Error',
    defaultMessage: 'An unexpected error occurred.',
  },
};

export function FallbackScreen({
  variant = 'error',
  message,
  onRetry,
  children,
  compact = false,
}) {
  const config = VARIANTS[variant] || VARIANTS.error;
  const Icon = config.icon;

  return (
    <div
      className={`flex items-center justify-center ${
        compact ? 'py-8 px-4' : 'min-h-[40vh] p-6'
      }`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`glass rounded-2xl text-center ${compact ? 'p-6 max-w-md w-full' : 'p-8 max-w-lg w-full'}`}
      >
        <div
          className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
          style={{ backgroundColor: `${config.color}15`, border: `1px solid ${config.color}30` }}
        >
          <Icon className="w-7 h-7" style={{ color: config.color }} />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">{config.title}</h3>
        <p className="text-sm text-slate-400 mb-6">{message || config.defaultMessage}</p>
        {children}
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
            style={{
              color: config.color,
              backgroundColor: `${config.color}15`,
              border: `1px solid ${config.color}40`,
            }}
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        )}
      </motion.div>
    </div>
  );
}

export function LoadingScreen({ message = 'Loading...' }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#050810] gap-4 grid-bg">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
        className="w-12 h-12 rounded-full border-2 border-[#00f0ff]/20 border-t-[#00f0ff]"
      />
      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="text-sm text-slate-400"
      >
        {message}
      </motion.p>
    </div>
  );
}
