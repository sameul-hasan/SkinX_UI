import { motion } from 'framer-motion'
import PublicTopBar from '../components/PublicTopBar'
import AwarenessPanel from '../components/AwarenessPanel'
import BoSkinChatbot from '../components/BoSkinChatbot'
import { awarenessCards, safetyDisclaimer } from '../data/mockData'

function AwarenessPage() {
  return (
    <div className="public-shell flex min-h-screen flex-col pb-6">
      <PublicTopBar />
      <main className="mx-auto grid w-full max-w-6xl flex-1 gap-3 p-4 sm:grid-cols-[1.35fr_1fr] sm:p-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <BoSkinChatbot />
        </motion.div>

        <div>
          <AwarenessPanel cards={awarenessCards} disclaimer={safetyDisclaimer} />
        </div>
      </main>
    </div>
  )
}

export default AwarenessPage
