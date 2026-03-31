import { House, MessageCircle, Sparkles } from 'lucide-react'

const tabs = [
  { id: 'home', label: 'Home', icon: House },
  { id: 'session', label: 'Session', icon: MessageCircle },
  { id: 'awareness', label: 'Awareness', icon: Sparkles },
]

function FooterBar({ activeView, setActiveView }) {
  return (
    <footer className="glass fixed inset-x-3 bottom-3 z-20 rounded-2xl border border-skx-brand-cyan/30 px-3 py-2 sm:inset-x-auto sm:left-1/2 sm:w-135 sm:-translate-x-1/2">
      <div className="flex items-center justify-between gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const active = activeView === tab.id

          return (
            <button
              key={tab.id}
              className={`flex flex-1 items-center justify-center gap-1 rounded-xl px-2 py-2 text-xs font-medium ${
                active
                  ? 'bg-linear-to-r from-skx-primary to-skx-secondary text-skx-bg-strong'
                  : 'glow-cyan text-skx-soft'
              }`}
              onClick={() => setActiveView(tab.id)}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          )
        })}
      </div>
    </footer>
  )
}

export default FooterBar
