import { ShieldAlert } from 'lucide-react'
import GlassCard from './GlassCard'

function AwarenessPanel({ cards, disclaimer, variant = 'dark' }) {
  const titleClass = variant === 'light' ? 'text-skx-brand-navy' : 'text-skx-brand-navy'
  const textClass = variant === 'light' ? 'text-skx-brand-navy/80' : 'text-skx-brand-navy/80'
  const alertClass = 'border-red-400/70 bg-red-50/70 text-red-700'

  return (
    <div className="space-y-3">
      {cards.map((card) => (
        <GlassCard key={card.title} variant={variant}>
          <p className={`text-sm font-semibold ${titleClass}`}>{card.title}</p>
          <p className={`mt-1 text-xs ${textClass}`}>{card.text}</p>
        </GlassCard>
      ))}

      <GlassCard variant={variant} className={alertClass}>
        <p className="flex items-center gap-1.5 text-sm font-semibold">
          <ShieldAlert size={14} />
          Safety Disclaimer
        </p>
        <p className="mt-1 text-xs text-red-700">{disclaimer}</p>
      </GlassCard>
    </div>
  )
}

export default AwarenessPanel
