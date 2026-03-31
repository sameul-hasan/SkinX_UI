import { useState } from 'react'
import { SendHorizontal } from 'lucide-react'
import GlassCard from './GlassCard'

const quickPrompts = ['How to protect skin daily?', 'When to consult dermatologist?', 'How to track spots?']

function getBotReply(message) {
  const normalized = message.toLowerCase()

  if (normalized.includes('protect') || normalized.includes('spf') || normalized.includes('sun')) {
    return 'Use SPF 30+, reapply every 2 hours outdoors, and combine with shade + protective clothing.'
  }
  if (normalized.includes('dermatologist') || normalized.includes('doctor') || normalized.includes('consult')) {
    return 'Consult a dermatologist if you notice rapid growth, bleeding, persistent irritation, or major color/border changes.'
  }
  if (normalized.includes('track') || normalized.includes('spot') || normalized.includes('scan')) {
    return 'Track with consistent lighting, same angle, and regular intervals so changes are easier to compare.'
  }

  return 'I am BoSkin. I can help with awareness guidance on prevention, early signs, and tracking habits.'
}

function BoSkinChatbot({ title = 'BoSkin Awareness Bot', subtitle = 'Public access, no login required' }) {
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState([
    {
      id: 'a0',
      sender: 'bot',
      text: 'Hi, I am BoSkin. I can guide you with prevention and early spot-check tips.',
    },
  ])

  function sendMessage(textValue) {
    const text = textValue.trim()
    if (!text) {
      return
    }

    const userMessage = { id: `u-${Date.now()}`, sender: 'user', text }
    const botMessage = { id: `b-${Date.now() + 1}`, sender: 'bot', text: getBotReply(text) }

    setMessages((prev) => [...prev, userMessage, botMessage])
    setDraft('')
  }

  return (
    <GlassCard className="h-[66vh] p-0">
      <div className="border-b border-skx-brand-cyan/20 px-4 py-3">
        <p className="text-sm font-semibold text-skx-brand-navy">{title}</p>
        <p className="text-xs text-skx-brand-navy/75">{subtitle}</p>
        <p className="mt-1 hidden text-xs text-skx-brand-navy/65 sm:block">
          Ask BoSkin about prevention, spot tracking, and when to consult a dermatologist.
        </p>
      </div>

      <div className="chat-scroll h-[calc(66vh-8.5rem)] space-y-2 overflow-y-auto px-3 py-3">
        {messages.map((message) => (
          <article
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <p
              className={`max-w-[86%] rounded-2xl px-3 py-2 text-sm ${
                message.sender === 'user'
                  ? 'rounded-br-md bg-linear-to-r from-skx-primary to-skx-secondary text-white'
                  : 'rounded-bl-md border border-skx-brand-cyan/25 bg-white/80 text-skx-brand-navy'
              }`}
            >
              {message.text}
            </p>
          </article>
        ))}
      </div>

      <div className="space-y-2 border-t border-skx-brand-cyan/20 p-3">
        <div className="hidden flex-wrap gap-2 sm:flex">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => sendMessage(prompt)}
              className="glow-cyan rounded-full border border-skx-brand-cyan/35 bg-white px-3 py-1.5 text-xs text-skx-brand-navy"
            >
              {prompt}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                sendMessage(draft)
              }
            }}
            placeholder="Ask BoSkin..."
            className="glow-cyan flex-1 rounded-xl border border-skx-brand-cyan/35 bg-white px-3 py-2 text-sm text-skx-brand-navy outline-none placeholder:text-skx-brand-navy/60"
          />
          <button onClick={() => sendMessage(draft)} className="btn-primary rounded-xl px-3 py-2">
            <SendHorizontal size={16} />
          </button>
        </div>
      </div>
    </GlassCard>
  )
}

export default BoSkinChatbot
