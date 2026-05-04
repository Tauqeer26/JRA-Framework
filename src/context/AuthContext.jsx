/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

// Demo users — in production replace with real auth
const DEMO_USERS = [
  { id: 1, name: 'Ali Khan', email: 'ali@jra.ai', password: 'demo1234', initials: 'AK' },
  { id: 2, name: 'Demo User', email: 'demo@jra.ai', password: 'demo1234', initials: 'DU' },
]

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('jra_user')
      return stored ? JSON.parse(stored) : null
    } catch { return null }
  })
  const [error, setError] = useState('')

  function login(email, password) {
    const found = DEMO_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )
    if (found) {
      const safe = { ...found }
      delete safe.password
      setUser(safe)
      localStorage.setItem('jra_user', JSON.stringify(safe))
      setError('')
      return true
    }
    setError('Invalid email or password')
    return false
  }

  function signup(name, email, password) {
    if (!name.trim() || !email.trim() || password.length < 6) {
      setError('Please fill all fields. Password must be at least 6 characters.')
      return false
    }
    const initials = name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    const newUser = { id: Date.now(), name: name.trim(), email, initials }
    setUser(newUser)
    localStorage.setItem('jra_user', JSON.stringify(newUser))
    setError('')
    return true
  }

  function logout() {
    setUser(null)
    localStorage.removeItem('jra_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, error, setError }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
