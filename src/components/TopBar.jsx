import { LogOut } from 'lucide-react'
import { Link } from 'react-router-dom'
import logo from '../../SkinX.png'

function TopBar({ email, onLogout }) {
  return (
    <header className="sticky top-0 z-20 border-b border-skx-brand-cyan/20 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-3 py-2 sm:px-5">
        <Link to="/" className="shrink-0 rounded-2xl" aria-label="Go to home">
          <img src={logo} alt="SkinX" className="h-8 w-auto rounded-2xl object-contain" />
        </Link>

        <p className="mx-2 truncate text-xs text-skx-soft">{email}</p>

        <button
          className="glass glow-cyan flex shrink-0 items-center gap-1.5 rounded-full border border-skx-brand-cyan/40 px-2.5 py-1.5 text-[11px] font-medium text-skx-soft"
          onClick={onLogout}
        >
          <LogOut size={13} />
          Logout
        </button>
      </div>
    </header>
  )
}

export default TopBar
