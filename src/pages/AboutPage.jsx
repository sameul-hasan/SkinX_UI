import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import GlassCard from '../components/GlassCard'
import PublicTopBar from '../components/PublicTopBar'
import PublicFooter from '../components/PublicFooter'

function AboutPage() {
  return (
    <div className="public-shell">
      <PublicTopBar />
      <main className="mx-auto w-full max-w-6xl space-y-3 p-4 sm:p-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard>
            <p className="text-base font-semibold text-skx-soft">About SkinX</p>
            <p className="mt-2 text-sm text-skx-soft/85">
              SkinX is a mobile-first awareness assistant designed to help people track visible skin
              changes with structured sessions, mock AI scan insights, and trend-friendly summaries.
            </p>
            <p className="mt-2 text-sm text-skx-soft/85">
              Our mission is to make skin awareness approachable and consistent for everyone by
              combining trusted guidance, easy daily habits, and clear progression insights.
            </p>
          </GlassCard>
        </motion.div>

        <GlassCard>
          <p className="text-sm font-semibold text-skx-soft">Mission</p>
          <p className="mt-2 text-xs text-skx-soft/85">
            To make skin awareness proactive, accessible, and action-oriented through trustworthy,
            easy-to-use digital guidance.
          </p>
        </GlassCard>

        <GlassCard>
          <p className="text-sm font-semibold text-skx-soft">Objectives</p>
          <ul className="mt-2 space-y-1 text-xs text-skx-soft/85">
            <li>• Help users capture high-quality tracking photos consistently.</li>
            <li>• Provide clear summary and comparison insights without complexity.</li>
            <li>• Encourage safe behavior and expert consultation for risk indicators.</li>
            <li>• Deliver a polished medical-tech user experience on mobile first.</li>
          </ul>
        </GlassCard>

        <GlassCard>
          <p className="text-sm font-semibold text-skx-soft">Developer Team Info</p>
          <p className="mt-2 text-xs text-skx-soft/85">
            SkinX is built by a cross-functional team focused on product trust, mobile UX quality,
            and practical awareness workflows.
          </p>
          <div className="mt-2 rounded-xl border border-skx-brand-cyan/25 bg-white/75 p-3">
            <p className="text-xs font-semibold text-skx-brand-navy">Core Team Members</p>
            <ul className="mt-1 space-y-0.5 text-xs text-skx-brand-navy/75">
              <li>• Md Sameul Hasan</li>
              <li>• Siddartho Shen</li>
              <li>• Asis Rahman</li>
              <li>• Redwan Ahmed</li>
            </ul>
          </div>
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            <div className="rounded-xl border border-skx-brand-cyan/25 bg-white/75 p-3">
              <p className="text-xs font-semibold text-skx-brand-navy">Product & UX Team</p>
              <p className="mt-1 text-xs text-skx-brand-navy/75">Defined user journeys, feature priorities, and trust-first interface architecture.</p>
              <p className="mt-1 text-[11px] text-skx-brand-navy/70">Scope: research, wireframes, interaction quality.</p>
            </div>
            <div className="rounded-xl border border-skx-brand-cyan/25 bg-white/75 p-3">
              <p className="text-xs font-semibold text-skx-brand-navy">Frontend Engineering Team</p>
              <p className="mt-1 text-xs text-skx-brand-navy/75">Built React dashboard, BoSkin chatbot, and scan/session intelligence workflows.</p>
              <p className="mt-1 text-[11px] text-skx-brand-navy/70">Scope: components, routing, performance, responsive behavior.</p>
            </div>
            <div className="rounded-xl border border-skx-brand-cyan/25 bg-white/75 p-3">
              <p className="text-xs font-semibold text-skx-brand-navy">Clinical Awareness Team</p>
              <p className="mt-1 text-xs text-skx-brand-navy/75">Prepared awareness copy, safety disclaimer rules, and escalation guidance.</p>
              <p className="mt-1 text-[11px] text-skx-brand-navy/70">Scope: health messaging clarity and responsible communication.</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <p className="text-sm font-semibold text-skx-soft">Core Capabilities</p>
          <ul className="mt-2 space-y-1 text-xs text-skx-soft/85">
            <li>• Awareness chatbot available publicly without login.</li>
            <li>• Private user dashboard with intake + scan + chat session history.</li>
            <li>• Admin intelligence view embedded inside the same dashboard (admin login only).</li>
          </ul>

          <p className="mt-3 text-sm font-semibold text-skx-soft">Explore</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Link
              to="/awareness"
              className="btn-primary rounded-xl px-3 py-2 text-xs font-semibold"
            >
              Open Awareness Bot
            </Link>
            <Link
              to="/signup"
              className="glow-cyan rounded-xl border border-skx-brand-cyan/35 bg-skx-bg-strong/45 px-3 py-2 text-xs font-semibold text-skx-soft"
            >
              Create Account
            </Link>
          </div>
        </GlassCard>
      </main>
      <PublicFooter />
    </div>
  )
}

export default AboutPage
