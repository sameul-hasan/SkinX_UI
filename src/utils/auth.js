import { loadState, saveState } from './storage'

const AUTH_USERS_KEY = 'skinx:users:v1'
const AUTH_CURRENT_KEY = 'skinx:current-user:v1'

export const DEFAULT_ADMIN = {
  email: 'admin@skinx.com',
  password: 'admin123',
  role: 'admin',
}

export function loadAuthUsers() {
  const users = loadState(AUTH_USERS_KEY, [DEFAULT_ADMIN]).map((user) => ({
    ...user,
    role: user.role ?? (user.email?.toLowerCase() === DEFAULT_ADMIN.email ? 'admin' : 'user'),
  }))
  const hasAdmin = users.some((user) => user.email.toLowerCase() === DEFAULT_ADMIN.email)
  return hasAdmin ? users : [DEFAULT_ADMIN, ...users]
}

export function saveAuthUsers(users) {
  return saveState(AUTH_USERS_KEY, users)
}

export function loadCurrentUser() {
  return loadState(AUTH_CURRENT_KEY, null)
}

export function saveCurrentUser(user) {
  return saveState(AUTH_CURRENT_KEY, user)
}

export function logoutUser() {
  localStorage.removeItem(AUTH_CURRENT_KEY)
}

export function createAccount(users, payload) {
  const email = payload.email.trim().toLowerCase()
  const password = payload.password.trim()

  if (!email || !password) {
    return { ok: false, message: 'Email and password are required.' }
  }

  if (users.some((user) => user.email.toLowerCase() === email)) {
    return { ok: false, message: 'Account already exists. Please login.' }
  }

  return {
    ok: true,
    user: {
      email,
      password,
      role: 'user',
    },
  }
}

export function loginUser(users, payload) {
  const email = payload.email.trim().toLowerCase()
  const password = payload.password.trim()

  const matched = users.find(
    (user) => user.email.toLowerCase() === email && user.password === password,
  )

  if (!matched) {
    return { ok: false, message: 'Invalid credentials.' }
  }

  return { ok: true, user: matched }
}
