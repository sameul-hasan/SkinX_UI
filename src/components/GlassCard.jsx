import { motion } from 'framer-motion'

function GlassCard({ className = '', children, variant = 'dark' }) {
  const base = variant === 'light' ? 'glass-light' : 'glass'

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className={`${base} rounded-2xl p-4 shadow-[0_8px_40px_-24px_rgba(35,25,92,0.35)] ${className}`}
    >
      {children}
    </motion.section>
  )
}

export default GlassCard
