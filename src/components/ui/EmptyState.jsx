import { motion } from 'framer-motion';
import { Inbox } from 'lucide-react';

export function EmptyState({
  icon: Icon = Inbox,
  title = 'No data yet',
  description = 'Data will appear here once synchronized.',
  action,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 px-6 text-center"
    >
      <div className="p-4 rounded-2xl bg-[#00f0ff]/5 border border-[#00f0ff]/15 mb-4">
        <Icon className="w-8 h-8 text-[#00f0ff]/60" />
      </div>
      <h4 className="text-sm font-semibold text-white mb-1">{title}</h4>
      <p className="text-xs text-slate-500 max-w-xs">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </motion.div>
  );
}
