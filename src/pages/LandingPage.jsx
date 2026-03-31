import { Link } from 'react-router-dom'
import { motion as Motion } from 'framer-motion'
import { ArrowRight, MessageCircleHeart, ShieldCheck, Sparkles } from 'lucide-react'
import logo from '../../SkinX.png'
import PublicTopBar from '../components/PublicTopBar'
import PublicFooter from '../components/PublicFooter'

function LandingPage() {
  return (
    <div className="public-shell">
      <PublicTopBar />

      <main className="mx-auto w-full max-w-6xl space-y-3 px-4 py-6 sm:px-6">
        <Motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-6 text-center sm:p-10"
        >
          <Motion.img
            initial={{ scale: 0.86, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.45 }}
            src={logo}
            alt="SkinX"
            className="mx-auto h-auto w-full max-w-105 object-contain drop-shadow-[0_20px_35px_rgba(32,192,224,0.35)]"
          />

          <p className="mx-auto mt-6 max-w-3xl text-sm text-skx-soft sm:text-base">
            SkinX is a next-generation skin awareness platform that combines a conversational assistant,
            session-based tracking, and scan trend summaries to help users act earlier and stay informed.
          </p>


          <div className="mt-6 grid gap-2 sm:mx-auto sm:max-w-sm">
            <Link
              to="/login"
              className="btn-primary flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold"
            >
              Enter Experience
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/signup"
              className="glow-cyan rounded-xl border border-skx-brand-cyan/35 bg-skx-bg-strong/45 px-4 py-3 text-sm font-medium text-skx-soft"
            >
              Create Account
            </Link>
            <Link
              to="/awareness"
              className="glow-cyan rounded-xl border border-skx-brand-cyan/40 bg-skx-bg-strong/55 px-4 py-3 text-sm font-medium text-skx-soft"
            >
              Try Awareness Bot (BoSkin)
            </Link>
          </div>
        </Motion.section>

        <section className="grid gap-3 sm:grid-cols-3">
          <article className="glass rounded-2xl p-4">
            <MessageCircleHeart size={16} className="text-skx-brand-cyan" />
            <p className="mt-2 text-sm font-semibold text-skx-soft">Chat-First Guidance</p>
            <p className="mt-1 text-xs text-skx-soft/85">Simple WhatsApp-style interaction for fast awareness support.</p>
          </article>
          <article className="glass rounded-2xl p-4">
            <ShieldCheck size={16} className="text-skx-brand-cyan" />
            <p className="mt-2 text-sm font-semibold text-skx-soft">Awareness + Safety</p>
            <p className="mt-1 text-xs text-skx-soft/85">Public awareness bot with guidance and clear medical disclaimer.</p>
          </article>
          <article className="glass rounded-2xl p-4">
            <Sparkles size={16} className="text-skx-brand-cyan" />
            <p className="mt-2 text-sm font-semibold text-skx-soft">Smart Product Experience</p>
            <p className="mt-1 text-xs text-skx-soft/85">Clear workflows built for real users, daily tracking, and reliable outcomes.</p>
          </article>
        </section>

        <section className="glass rounded-2xl p-4">
          <p className="text-sm font-semibold text-skx-soft">Product Highlights</p>
          <ul className="mt-2 space-y-1 text-xs text-skx-soft/85">
            <li>• Problem: Most users miss subtle skin changes until late.</li>
            <li>• Solution: SkinX combines chatbot guidance with mock scan trend tracking.</li>
            <li>• Outcome: Better awareness habits, faster escalation for expert consultation.</li>
            <li>• Model: Freemium awareness + premium guided monitoring workflow.</li>
            <li>• Differentiator: Logo-first, trust-oriented health UX with mobile speed.</li>
          </ul>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <div className="rounded-xl border border-skx-brand-cyan/25 bg-white/75 p-3">
              <p className="text-xs font-semibold text-skx-brand-navy">Clinical Awareness</p>
              <p className="mt-1 text-xs text-skx-brand-navy/75">Guides users toward timely dermatologist consultation decisions.</p>
            </div>
            <div className="rounded-xl border border-skx-brand-cyan/25 bg-white/75 p-3">
              <p className="text-xs font-semibold text-skx-brand-navy">Smart Session Tracking</p>
              <p className="mt-1 text-xs text-skx-brand-navy/75">Persistent intake, scans, and conversation context in one flow.</p>
            </div>
            <div className="rounded-xl border border-skx-brand-cyan/25 bg-white/75 p-3">
              <p className="text-xs font-semibold text-skx-brand-navy">BoSkin Assistant</p>
              <p className="mt-1 text-xs text-skx-brand-navy/75">Always-available awareness support with simple natural chat.</p>
            </div>
          </div>
          <Link
            to="/about"
            className="glow-cyan mt-3 inline-flex rounded-xl border border-skx-brand-cyan/35 bg-skx-bg-strong/45 px-3 py-2 text-xs font-semibold text-skx-soft"
          >
            Learn About SkinX
          </Link>
        </section>

        <section className="glass rounded-2xl p-4">
          <p className="text-sm font-semibold text-skx-soft">Clinical AI Pipeline (Featured)</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <div className="rounded-xl border border-skx-brand-cyan/25 bg-white/75 p-3">
              <p className="text-xs font-semibold text-skx-brand-navy">Stage 0: OpenCV Signal Processing</p>
              <ul className="mt-1 space-y-0.5 text-xs text-skx-brand-navy/75">
                <li>• CLAHE on LAB Lightness channel to correct shadows without color drift.</li>
                <li>• DullRazor flow: Black-Hat transform, hair mask threshold, cv2.inpaint cleanup.</li>
                <li>• Memory-safe path: image bytes are read in memory (NumPy), no temp files in production.</li>
              </ul>
            </div>
            <div className="rounded-xl border border-skx-brand-cyan/25 bg-white/75 p-3">
              <p className="text-xs font-semibold text-skx-brand-navy">Inference Architecture</p>
              <ul className="mt-1 space-y-0.5 text-xs text-skx-brand-navy/75">
                <li>• FastAPI async flow for non-blocking execution.</li>
                <li>• EA-Net segmentation then Swin-T feature extraction.</li>
                <li>• 3-image vectors fused with max pooling before MLP clinical head.</li>
              </ul>
            </div>
            <div className="rounded-xl border border-skx-brand-cyan/25 bg-white/75 p-3">
              <p className="text-xs font-semibold text-skx-brand-navy">Clinical Safety Logic</p>
              <ul className="mt-1 space-y-0.5 text-xs text-skx-brand-navy/75">
                <li>• 10-pass MC Dropout returns mean confidence + uncertainty variance.</li>
                <li>• OOD rejection gate blocks unreliable predictions.</li>
                <li>• Danger class response includes explainable EigenCAM heatmap.</li>
              </ul>
            </div>
            <div className="rounded-xl border border-skx-brand-cyan/25 bg-white/75 p-3">
              <p className="text-xs font-semibold text-skx-brand-navy">Capture & Metadata Flow</p>
              <ul className="mt-1 space-y-0.5 text-xs text-skx-brand-navy/75">
                <li>• Wide context shot + straight/angled close-up reticle workflow.</li>
                <li>• Trauma check gate, patient age, and Fitzpatrick type collection.</li>
                <li>• High-fidelity compression and secure API payload packaging.</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}

export default LandingPage
