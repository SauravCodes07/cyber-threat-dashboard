import { motion } from 'framer-motion';

export function ChartContainer({ children, loading, empty, emptyMessage = 'No chart data' }) {
  if (loading) {
    return <div className="h-52 rounded-xl bg-[#1a2744]/40 animate-pulse" aria-busy="true" />;
  }

  if (empty) {
    return (
      <div className="h-52 rounded-xl border border-dashed border-[#1a2744] flex items-center justify-center">
        <p className="text-xs text-slate-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
