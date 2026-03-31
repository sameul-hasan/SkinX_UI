import { ActivitySquare, BarChart3, ScanSearch } from 'lucide-react'
import { motion } from 'framer-motion'

const actionIcons = {
  scan: ScanSearch,
  compare: ActivitySquare,
  summary: BarChart3,
}

function QuickActions({ actions, onRun }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {actions.map((action) => {
        const Icon = actionIcons[action.id]

        return (
          <motion.button
            key={action.id}
            whileTap={{ scale: 0.96 }}
            className="glass glow-cyan flex shrink-0 items-center gap-1.5 rounded-full border border-skx-brand-cyan/35 px-3 py-2 text-xs text-skx-soft"
            onClick={() => onRun(action.id)}
          >
            {Icon && <Icon size={14} />}
            {action.label}
          </motion.button>
        )
      })}
    </div>
  )
}

export default QuickActions
