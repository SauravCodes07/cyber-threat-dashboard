import { motion } from 'framer-motion';

export function GlassCard({
  children,
  className = '',
  hover = true,
  delay = 0,
  onClick,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={
        hover
          ? {
              y: -3,
              boxShadow: '0 8px 32px rgba(0, 240, 255, 0.08)',
              transition: { duration: 0.2 },
            }
          : undefined
      }
      whileTap={onClick ? { scale: 0.99 } : undefined}
      onClick={onClick}
      className={`glass rounded-2xl p-4 sm:p-5 ${
        hover ? 'hover:border-[#00f0ff]/25 transition-colors cursor-default' : ''
      } ${className}`}
    >
      {children}
    </motion.div>
  );
}
