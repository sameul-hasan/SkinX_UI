import { useMemo, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import AppPage from './pages/AppPage'
import AboutPage from './pages/AboutPage'
import AwarenessPage from './pages/AwarenessPage'
import {
  createAccount,
  loadAuthUsers,
  loadCurrentUser,
  loginUser,
  logoutUser,
  saveAuthUsers,
  saveCurrentUser,
} from './utils/auth'

function App() {
  const [users, setUsers] = useState(() => loadAuthUsers())
  const [currentUser, setCurrentUser] = useState(() => loadCurrentUser())

  const isAdmin = useMemo(() => currentUser?.role === 'admin', [currentUser])

  function handleSignup(payload) {
    const result = createAccount(users, payload)
    if (!result.ok) {
      return result
    }

    const updatedUsers = [...users, result.user]
    setUsers(updatedUsers)
    setCurrentUser(result.user)
    saveAuthUsers(updatedUsers)
    saveCurrentUser(result.user)
    return { ok: true }
  }

  function handleLogin(payload) {
    const result = loginUser(users, payload)
    if (!result.ok) {
      return result
    }

    setCurrentUser(result.user)
    saveCurrentUser(result.user)
    return { ok: true }
  }

  function handleLogout() {
    setCurrentUser(null)
    logoutUser()
  }

  function handleToggleUserAdmin(targetEmail) {
    const normalizedEmail = targetEmail.toLowerCase()
    const updatedUsers = users.map((user) => {
      if (user.email.toLowerCase() !== normalizedEmail) {
        return user
      }

      if (user.email.toLowerCase() === 'admin@skinx.com') {
        return { ...user, role: 'admin' }
      }

      return { ...user, role: user.role === 'admin' ? 'user' : 'admin' }
    })

    setUsers(updatedUsers)
    saveAuthUsers(updatedUsers)

    if (currentUser && currentUser.email.toLowerCase() === normalizedEmail) {
      const updatedCurrent = updatedUsers.find(
        (user) => user.email.toLowerCase() === normalizedEmail,
      )
      setCurrentUser(updatedCurrent)
      saveCurrentUser(updatedCurrent)
    }
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/awareness" element={<AwarenessPage />} />
      <Route
        path="/login"
        element={
          currentUser ? <Navigate to="/app" replace /> : <LoginPage onLogin={handleLogin} />
        }
      />
      <Route
        path="/signup"
        element={
          currentUser ? <Navigate to="/app" replace /> : <SignupPage onSignup={handleSignup} />
        }
      />
      <Route
        path="/app"
        element={
          currentUser ? (
            <AppPage
              currentUser={currentUser}
              users={users}
              isAdmin={isAdmin}
              onLogout={handleLogout}
              onToggleUserAdmin={handleToggleUserAdmin}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
