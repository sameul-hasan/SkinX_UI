import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../SkinX.png'
import PublicTopBar from '../components/PublicTopBar'

function LoginPage({ onLogin }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  function submit(event) {
    event.preventDefault()
    const result = onLogin(form)
    if (!result.ok) {
      setError(result.message)
      return
    }
    navigate('/app')
  }

  return (
    <div className="public-shell min-h-screen">
      <PublicTopBar />
      <main className="mx-auto flex w-full max-w-md items-center px-4 py-8">
        <section className="glass w-full rounded-3xl p-6 sm:p-8">
          <Link to="/" className="mx-auto block w-fit rounded-2xl">
            <img src={logo} alt="SkinX" className="mx-auto h-28 w-28 rounded-2xl object-contain" />
          </Link>

          <form className="mt-6 grid gap-3" onSubmit={submit}>
            <label className="text-xs font-semibold text-skx-brand-navy">
              Email <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              required
              className="rounded-xl border border-skx-brand-cyan/35 bg-white px-3 py-2.5 text-sm text-skx-brand-navy outline-none placeholder:text-skx-brand-navy/60"
              placeholder="Email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            />
            <label className="text-xs font-semibold text-skx-brand-navy">
              Password <span className="text-rose-500">*</span>
            </label>
            <input
              type="password"
              required
              className="rounded-xl border border-skx-brand-cyan/35 bg-white px-3 py-2.5 text-sm text-skx-brand-navy outline-none placeholder:text-skx-brand-navy/60"
              placeholder="Password"
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            />
            {error && <p className="text-xs text-rose-600">{error}</p>}

            <button
              type="submit"
              className="btn-primary rounded-xl px-4 py-2.5 text-sm font-semibold"
            >
              Login
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-skx-brand-navy/75">
            New here? <Link to="/signup" className="font-semibold text-skx-brand-navy">Create account</Link>
          </p>
          <p className="mt-1 text-center text-[11px] text-skx-brand-navy/65">Admin email: admin@skinx.com</p>
        </section>
      </main>
    </div>
  )
}

export default LoginPage
