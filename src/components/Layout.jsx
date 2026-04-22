import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  Calendar, Home, Menu, X, Zap, LogOut,
  LayoutDashboard, PlusCircle, ShieldCheck
} from 'lucide-react'
import styles from './Layout.module.css'

// Public sidebar: Home + Events only
const publicNavItems = [
  { to: '/home', label: 'Home', icon: Home },
  { to: '/events', label: 'Events', icon: Calendar },
]

// Admin sidebar: Dashboard + Add Event
const adminNavItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/add-event', label: 'Add Event', icon: PlusCircle },
]

export default function Layout({ children, isAdmin = false }) {
  const { isLoggedIn, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navItems = isAdmin ? adminNavItems : publicNavItems

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className={styles.root}>
      <aside className={`${styles.sidebar} ${isAdmin ? styles.adminSidebar : ''} ${mobileOpen ? styles.open : ''}`}>
        <div className={styles.logo}>
          <div className={styles.logoIcon} style={{ background: isAdmin ? 'var(--warning)' : 'var(--accent)' }}>
            {isAdmin ? <ShieldCheck size={16} /> : <Zap size={16} />}
          </div>
          <div>
            <div className={styles.logoTitle}>CampusEvent<span>UI</span></div>
            <div className={styles.logoSub}>{isAdmin ? 'Admin Panel' : 'ISPSC Tagudin'}</div>
          </div>
        </div>

        <nav className={styles.nav}>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/home'}
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <Icon size={16} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className={styles.sidebarBottom}>
          {isAdmin && isLoggedIn && (
            <button className={styles.logoutBtn} onClick={handleLogout}>
              <LogOut size={13} /> Logout
            </button>
          )}
          {!isAdmin && (
            <button className={styles.adminBtn} onClick={() => navigate('/login')}>
              <ShieldCheck size={13} /> Admin Login
            </button>
          )}
        </div>
      </aside>

      {mobileOpen && <div className={styles.overlay} onClick={() => setMobileOpen(false)} />}

      <div className={styles.main}>
        <header className={styles.header}>
          <button className={styles.menuBtn} onClick={() => setMobileOpen(o => !o)}>
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          {isAdmin && isLoggedIn && (
            <span className={styles.adminTag}>Admin</span>
          )}
        </header>

        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  )
}