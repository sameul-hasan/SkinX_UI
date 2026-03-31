import { Link } from 'react-router-dom'
import logo from '../../SkinX.png'

function PublicFooter() {
  return (
    <footer className="mx-auto w-full max-w-6xl px-4 pb-6 sm:px-6">
      <div className="glass flex flex-col gap-3 rounded-2xl px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link to="/" className="inline-flex items-center gap-2" aria-label="Go to home">
            <img src={logo} alt="SkinX" className="h-9 w-auto rounded-xl object-contain" />
            <p className="text-sm font-semibold text-skx-soft"></p>
          </Link>
          <p className="mt-1 text-xs text-skx-soft/80">
            Skin awareness platform for early guidance, session tracking, and smarter follow-up.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Link
            to="/about"
            className="rounded-lg border border-skx-brand-cyan/35 bg-white/70 px-2.5 py-1.5 text-skx-brand-navy"
          >
            About
          </Link>
          <Link
            to="/awareness"
            className="rounded-lg border border-skx-brand-cyan/35 bg-white/70 px-2.5 py-1.5 text-skx-brand-navy"
          >
            BoSkin
          </Link>
          <Link
            to="/login"
            className="rounded-lg border border-skx-brand-cyan/35 bg-white/70 px-2.5 py-1.5 text-skx-brand-navy"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="rounded-lg border border-skx-brand-cyan/35 bg-white/70 px-2.5 py-1.5 text-skx-brand-navy"
          >
            Sign Up
          </Link>
        </div>
      </div>
      <p className="mt-2 text-center text-[11px] text-skx-soft/70">
        © {new Date().getFullYear()} SkinX. All rights reserved.
      </p>
    </footer>
  )
}

export default PublicFooter