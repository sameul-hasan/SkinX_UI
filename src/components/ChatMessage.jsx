import { AlertCircle, CheckCircle2, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { motion } from 'framer-motion'

function riskTone(risk) {
  if (risk === 'High') return 'text-rose-700 bg-rose-100 border-rose-300/80'
  if (risk === 'Moderate') return 'text-amber-700 bg-amber-100 border-amber-300/80'
  return 'text-emerald-700 bg-emerald-100 border-emerald-300/80'
}

function ChatMessage({ message }) {
  const isUser = message.sender === 'user'

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[86%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
          isUser
            ? 'rounded-br-md bg-linear-to-r from-skx-primary to-skx-secondary text-skx-bg-strong'
            : 'rounded-bl-md border border-white/20 bg-skx-bubble-ai/90 text-skx-bg-strong'
        }`}
      >
        {message.text && <p>{message.text}</p>}

        {message.kind === 'scan' && message.payload && (
          <div className="mt-2 space-y-2 rounded-xl border border-skx-brand-cyan/25 bg-[#f8fbff] px-3 py-2 text-xs text-slate-700">
            <div className="flex items-center justify-between">
              <span className={`rounded-full border px-2 py-0.5 ${riskTone(message.payload.risk)}`}>
                {message.payload.risk} Risk
              </span>
              <span>{message.payload.confidence}% confidence</span>
            </div>
            <p>{message.payload.notes}</p>
            {message.payload.details?.markedPreviewImages && (
              <div>
                <p className="mb-1 text-[11px] font-semibold text-slate-700">Saved marked crops</p>
                <div className="grid grid-cols-3 gap-1">
                  {message.payload.details.markedPreviewImages.closeUp && (
                    <img
                      src={message.payload.details.markedPreviewImages.closeUp}
                      alt="Saved close shot crop"
                      className="h-12 w-12 rounded border border-skx-brand-cyan/30 object-cover"
                    />
                  )}
                  {message.payload.details.markedPreviewImages.midRange && (
                    <img
                      src={message.payload.details.markedPreviewImages.midRange}
                      alt="Saved 45 degree crop"
                      className="h-12 w-12 rounded border border-skx-brand-cyan/30 object-cover"
                    />
                  )}
                  {message.payload.details.markedPreviewImages.bodyContext && (
                    <img
                      src={message.payload.details.markedPreviewImages.bodyContext}
                      alt="Saved wide shot crop"
                      className="h-12 w-12 rounded border border-skx-brand-cyan/30 object-cover"
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {message.kind === 'compare' && message.payload && (
          <div className="mt-2 space-y-2 rounded-xl border border-skx-brand-cyan/25 bg-[#f8fbff] px-3 py-2 text-xs text-slate-700">
            <p className="font-semibold text-slate-800">Comparison Insight</p>
            <div className="flex items-center gap-1.5">
              {message.payload.riskDirection === 'up' ? (
                <ArrowUpRight size={14} className="text-rose-500" />
              ) : message.payload.riskDirection === 'down' ? (
                <ArrowDownRight size={14} className="text-emerald-500" />
              ) : (
                <CheckCircle2 size={14} className="text-indigo-500" />
              )}
              <span>{message.payload.riskChange}</span>
            </div>
            <p>Confidence shift: {message.payload.confidenceShift}</p>
            <p>{message.payload.conditionInsight}</p>
          </div>
        )}

        {message.kind === 'summary' && message.payload && (
          <div className="mt-2 rounded-xl border border-skx-brand-cyan/25 bg-[#f8fbff] px-3 py-2 text-xs text-slate-700">
            <p className="mb-1 font-semibold text-slate-800">Overall Assessment</p>
            <p className="mb-1 flex items-center gap-1.5">
              <AlertCircle size={13} className="text-indigo-500" />
              Trend: {message.payload.trend}
            </p>
            <p>Key observations: {message.payload.keyObservations.join(' • ')}</p>
            <p className="mt-1">Next steps: {message.payload.nextSteps.join(' • ')}</p>
          </div>
        )}
      </div>
    </motion.article>
  )
}

export default ChatMessage
