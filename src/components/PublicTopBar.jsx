import { Link, useLocation } from 'react-router-dom'
import logo from '../../SkinX.png'

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/awareness', label: 'BoSkin' },
  { to: '/login', label: 'Login' },
]

function PublicTopBar() {
  const location = useLocation()

  return (
    <header className="sticky top-0 z-20 border-b border-skx-brand-cyan/20 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-3 py-3 sm:px-5">
        <Link to="/" className="shrink-0">
          <img src={logo} alt="SkinX" className="h-8 w-auto rounded-xl object-contain" />
        </Link>

        <nav className="flex items-center gap-1 overflow-x-auto">
          {links.map((link) => {
            const active = location.pathname === link.to
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${
                  active
                    ? 'bg-linear-to-r from-skx-primary to-skx-secondary text-skx-bg-strong'
                    : 'glow-cyan border border-skx-brand-cyan/30 bg-skx-bg-strong/45 text-skx-soft'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}

export default PublicTopBar
