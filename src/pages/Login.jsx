import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Lock, User, LogIn, ArrowLeft } from 'lucide-react'
import styles from './Login.module.css'

export default function Login() {
  const { login, error } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = () => {
    const ok = login(username, password)
    if (ok) navigate('/admin/dashboard')
  }

  const handleKey = (e) => {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <button
          onClick={() => navigate('/home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'none',
            color: 'var(--text2)',
            fontSize: 13,
            marginBottom: 16,
            padding: '4px 0',
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={15} /> Back to Home
        </button>

        <div className={styles.logo}>
          <div className={styles.logoIcon}>⚡</div>
          <div className={styles.logoText}>
            <span className={styles.logoTitle}>CampusEvent<b>UI</b></span>
            <span className={styles.logoSub}>ISPSC Tagudin</span>
          </div>
        </div>

        <h2 className={styles.heading}>Admin Login</h2>
        <p className={styles.sub}>Sign in to access the dashboard</p>

        <div className={styles.field}>
          <label>Username</label>
          <div className={styles.inputWrap}>
            <User size={15} className={styles.icon} />
            <input
              className={styles.input}
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              onKeyDown={handleKey}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label>Password</label>
          <div className={styles.inputWrap}>
            <Lock size={15} className={styles.icon} />
            <input
              className={styles.input}
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={handleKey}
            />
          </div>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button className={styles.btn} onClick={handleSubmit}>
          <LogIn size={15} /> Sign In
        </button>

        <p className={styles.hint}>Default: admin / ispsc2026</p>
      </div>
    </div>
  )
}