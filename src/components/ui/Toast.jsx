import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export function Toast({ message, type = 'success', onClose }) {
  const isSuccess = type === 'success';

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className={`fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-[100] flex items-start gap-3 p-4 rounded-xl border shadow-2xl ${
        isSuccess
          ? 'bg-[#0d1424] border-[#00ff88]/40 shadow-[#00ff88]/10'
          : 'bg-[#0d1424] border-[#ff3366]/40 shadow-[#ff3366]/10'
      }`}
      role="alert"
    >
      {isSuccess ? (
        <CheckCircle className="w-5 h-5 text-[#00ff88] shrink-0 mt-0.5" />
      ) : (
        <AlertCircle className="w-5 h-5 text-[#ff3366] shrink-0 mt-0.5" />
      )}
      <p className="text-sm text-slate-200 flex-1">{message}</p>
      <button
        type="button"
        onClick={onClose}
        className="text-slate-500 hover:text-white shrink-0 p-0.5"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

export function ToastContainer({ toasts, onDismiss }) {
  return (
    <AnimatePresence>
      {toasts.map((t) => (
        <Toast key={t.id} message={t.message} type={t.type} onClose={() => onDismiss(t.id)} />
      ))}
    </AnimatePresence>
  );
}
