import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Database, X } from 'lucide-react';
import { useState } from 'react';

export function StatusBanner({ isOffline, firestoreError }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || (!isOffline && !firestoreError)) return null;

  const offline = isOffline;
  const message = offline
    ? 'You are offline. Showing cached data where available.'
    : 'Firestore sync interrupted. Retrying in the background.';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="overflow-hidden"
      >
        <div
          className={`flex items-center justify-between gap-3 px-4 py-2.5 text-xs border-b ${
            offline
              ? 'bg-[#fbbf24]/10 border-[#fbbf24]/20 text-[#fbbf24]'
              : 'bg-[#00f0ff]/10 border-[#00f0ff]/20 text-[#00f0ff]'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            {offline ? (
              <WifiOff className="w-3.5 h-3.5 shrink-0" />
            ) : (
              <Database className="w-3.5 h-3.5 shrink-0" />
            )}
            <span className="truncate">{message}</span>
          </div>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="shrink-0 p-1 rounded hover:bg-white/5"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
