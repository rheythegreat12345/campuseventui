import { useEvents } from '../context/EventContext'
import { useNavigate } from 'react-router-dom'
import EventCard from '../components/EventCard'
import { ArrowRight } from 'lucide-react'
import styles from './Home.module.css'

export default function Home() {
  const { events, liveStats } = useEvents()
  const navigate = useNavigate()

  const liveEvents = events.filter(e => e.status === 'live')
  const upcomingEvents = events.filter(e => e.status === 'upcoming').slice(0, 3)

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroText}>
          <h1 className={styles.heroTitle}>
            Campus Events<br />
            <span>Hub</span>
          </h1>
          <p className={styles.heroSub}>
            Discover, register, and stay updated on all ISPSC Tagudin campus events in real-time.
          </p>
          <div className={styles.heroBtns}>
            <button className={styles.btnPrimary} onClick={() => navigate('/events')}>
              Browse Events <ArrowRight size={16} />
            </button>
            <button className={styles.btnGhost} onClick={() => navigate('/add-event')}>
              Add Event
            </button>
          </div>
        </div>
      </div>

      {/* Live Events */}
      {liveEvents.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <h2><span className="live-dot" style={{ marginRight: 8 }} />Happening Now</h2>
          </div>
          <div className={styles.grid}>
            {liveEvents.map(e => <EventCard key={e.id} event={e} />)}
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2>Upcoming Events</h2>
          <button className={styles.viewAll} onClick={() => navigate('/events')}>
            View All <ArrowRight size={14} />
          </button>
        </div>
        <div className={styles.grid}>
          {upcomingEvents.map(e => <EventCard key={e.id} event={e} />)}
        </div>
      </section>
    </div>
  )
}