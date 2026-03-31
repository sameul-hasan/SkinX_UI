export const STORAGE_KEYS = {
  sessions: 'skinx:sessions:v1',
  activeSessionId: 'skinx:active-session:v1',
  authEmail: 'skinx:auth-email:v1',
}

export function loadState(key, fallbackValue) {
  try {
    const value = localStorage.getItem(key)
    if (!value) {
      return fallbackValue
    }
    return JSON.parse(value)
  } catch {
    return fallbackValue
  }
}

export function saveState(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    return null
  }
  return value
}
