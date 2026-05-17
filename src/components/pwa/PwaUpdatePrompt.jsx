import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Wifi, X } from 'lucide-react';

export function PwaUpdatePrompt() {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [updateFn, setUpdateFn] = useState(null);

  useEffect(() => {
    let updateSW = null;

    import('virtual:pwa-register')
      .then(({ registerSW }) => {
        updateSW = registerSW({
          immediate: true,
          onNeedRefresh() {
            setNeedRefresh(true);
          },
          onOfflineReady() {
            setOfflineReady(true);
            setTimeout(() => setOfflineReady(false), 4000);
          },
          onRegisteredSW(swUrl, registration) {
            if (registration) {
              setInterval(() => registration.update(), 60 * 60 * 1000);
            }
          },
        });
        setUpdateFn(() => updateSW);
      })
      .catch(() => {
        /* PWA register unavailable in dev without plugin */
      });

    return () => {
      updateSW = null;
    };
  }, []);

  const handleUpdate = () => {
    if (updateFn) updateFn(true);
    setNeedRefresh(false);
    setDismissed(true);
  };

  if (dismissed && !needRefresh) return null;

  return (
    <AnimatePresence>
      {(needRefresh || offlineReady) && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-16 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-[90]"
        >
          <div
            className={`flex items-start gap-3 p-4 rounded-xl border shadow-2xl ${
              needRefresh
                ? 'bg-[#0d1424] border-[#00f0ff]/30'
                : 'bg-[#0d1424] border-[#00ff88]/30'
            }`}
          >
            {needRefresh ? (
              <RefreshCw className="w-5 h-5 text-[#00f0ff] shrink-0 mt-0.5" />
            ) : (
              <Wifi className="w-5 h-5 text-[#00ff88] shrink-0 mt-0.5" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white">
                {needRefresh ? 'Update available' : 'Ready for offline use'}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {needRefresh
                  ? 'A new version of CyberSec is ready.'
                  : 'App shell cached. Live threat data requires network.'}
              </p>
              {needRefresh && (
                <button
                  type="button"
                  onClick={handleUpdate}
                  className="mt-2 text-xs font-semibold text-[#00f0ff] hover:underline"
                >
                  Reload now
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                setDismissed(true);
                setNeedRefresh(false);
                setOfflineReady(false);
              }}
              className="text-slate-500 hover:text-white shrink-0"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
