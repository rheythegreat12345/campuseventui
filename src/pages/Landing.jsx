import { useNavigate } from 'react-router-dom'
import { useEvents } from '../context/EventContext'
import { Calendar, Users, Activity, ArrowRight, Megaphone } from 'lucide-react'
import styles from './Landing.module.css'

export default function Landing() {
  const { events, liveStats } = useEvents()
  const navigate = useNavigate()

  const liveEvents = events.filter(e => e.status === 'live')
  const upcomingEvents = events.filter(e => e.status === 'upcoming').slice(0, 3)

  return (
    <div className={styles.page}>
      {/* Navbar */}
      <nav className={styles.nav}>
        <div className={styles.navLogo}>⚡ CampusEvent<span>UI</span></div>
        <div className={styles.navLinks}>
          <button onClick={() => navigate('/events')}>Events</button>
          <button className={styles.navLogin} onClick={() => navigate('/login')}>Admin Login</button>
        </div>
      </nav>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <span className="live-dot" />
            <span>Live Updates Active</span>
          </div>
          <h1 className={styles.heroTitle}>
            ISPSC Campus<br />
            <span>Events Hub</span>
          </h1>
          <p className={styles.heroSub}>
            Discover and register for all campus events at ISPSC Tagudin — in real time.
          </p>
          <div className={styles.heroBtns}>
            <button className={styles.btnPrimary} onClick={() => navigate('/events')}>
              Browse Events <ArrowRight size={15} />
            </button>
            <button className={styles.btnOutline} onClick={() => navigate('/login')}>
              Admin Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className={styles.stats}>
        <div className={styles.statItem}>
          <Users size={20} color="var(--accent)" />
          <div className={styles.statVal}>{liveStats.totalAttendees.toLocaleString()}</div>
          <div className={styles.statLabel}>Total Attendees</div>
        </div>
        <div className={styles.statItem}>
          <Activity size={20} color="var(--accent3)" />
          <div className={styles.statVal}>{liveStats.liveEvents}</div>
          <div className={styles.statLabel}>Live Now</div>
        </div>
        <div className={styles.statItem}>
          <Calendar size={20} color="var(--accent2)" />
          <div className={styles.statVal}>{events.filter(e => e.status === 'upcoming').length}</div>
          <div className={styles.statLabel}>Upcoming</div>
        </div>
      </section>

      {/* Live Events */}
      {liveEvents.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <h2><span className="live-dot" style={{ marginRight: 8 }} />Happening Now</h2>
          </div>
          <div className={styles.eventGrid}>
            {liveEvents.map(e => (
              <div key={e.id} className={styles.eventCard} onClick={() => navigate(`/events/${e.id}`)}>
                <div className={styles.cardTop} style={{ borderColor: e.color }}>
                  <span className={styles.liveTag}><span className="live-dot" style={{ width: 6, height: 6 }} /> LIVE</span>
                  <span className={styles.category}>{e.category}</span>
                </div>
                <h3 className={styles.cardTitle}>{e.title}</h3>
                <p className={styles.cardMeta}>📍 {e.location}</p>
                <p className={styles.cardMeta}>👥 {e.registered}/{e.capacity} registered</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2>Upcoming Events</h2>
          <button className={styles.viewAll} onClick={() => navigate('/events')}>
            View All <ArrowRight size={13} />
          </button>
        </div>
        <div className={styles.eventGrid}>
          {upcomingEvents.map(e => (
            <div key={e.id} className={styles.eventCard} onClick={() => navigate(`/events/${e.id}`)}>
              <div className={styles.cardTop} style={{ borderColor: e.color }}>
                <span className={styles.upTag}>Upcoming</span>
                <span className={styles.category}>{e.category}</span>
              </div>
              <h3 className={styles.cardTitle}>{e.title}</h3>
              <p className={styles.cardMeta}>📅 {new Date(e.date).toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              <p className={styles.cardMeta}>📍 {e.location}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>© 2026 ISPSC Tagudin · CampusEventUI</p>
      </footer>
    </div>
  )
}
