import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const ADMIN_USER = 'admin'
const ADMIN_PASS = 'ispsc2026'

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [error, setError] = useState('')

  const login = (username, password) => {
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      setIsLoggedIn(true)
      setError('')
      return true
    }
    setError('Invalid username or password.')
    return false
  }

  const logout = () => setIsLoggedIn(false)

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
