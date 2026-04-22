import { useNavigate } from 'react-router-dom'
import { useEvents } from '../context/EventContext'
import { Calendar, MapPin, Users, Trash2, ArrowRight } from 'lucide-react'
import styles from './EventCard.module.css'

const STATUS_LABELS = {
  live: 'LIVE',
  upcoming: 'Upcoming',
  completed: 'Completed',
}

const CATEGORY_EMOJI = {
  Academic: '📚',
  Sports: '🏅',
  Cultural: '🎭',
  Community: '🌿',
  Celebration: '🎉',
}

export default function EventCard({ event, showDelete = false }) {
  const navigate = useNavigate()
  const { deleteEvent, registerForEvent } = useEvents()
  const pct = Math.round((event.registered / event.capacity) * 100)
  const isFull = event.registered >= event.capacity

  return (
    <div
      className={`${styles.card} ${event.status === 'live' ? styles.liveCard : ''} fade-in`}
      style={{ '--cat-color': event.color }}
    >
      <div className={styles.top}>
        <div className={styles.categoryBadge}>
          <span>{CATEGORY_EMOJI[event.category] || '📌'}</span>
          <span>{event.category}</span>
        </div>
        <span className={`${styles.status} ${styles[event.status]}`}>
          {event.status === 'live' && <span className="live-dot" style={{ width: 6, height: 6 }} />}
          {STATUS_LABELS[event.status]}
        </span>
      </div>

      <h3 className={styles.title}>{event.title}</h3>
      <p className={styles.desc}>{event.description}</p>

      <div className={styles.meta}>
        <div className={styles.metaItem}>
          <Calendar size={13} />
          <span>{new Date(event.date + 'T' + event.time).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })} · {event.time}</span>
        </div>
        <div className={styles.metaItem}>
          <MapPin size={13} />
          <span>{event.location}</span>
        </div>
      </div>

      <div className={styles.capacity}>
        <div className={styles.capRow}>
          <span className={styles.capLabel}>
            <Users size={12} />
            {event.registered}/{event.capacity}
          </span>
          <span className={styles.capPct} style={{ color: pct > 90 ? 'var(--danger)' : pct > 70 ? 'var(--warning)' : 'var(--accent3)' }}>
            {pct}%
          </span>
        </div>
        <div className={styles.bar}>
          <div
            className={styles.barFill}
            style={{
              width: `${pct}%`,
              background: pct > 90 ? 'var(--danger)' : pct > 70 ? 'var(--warning)' : 'var(--accent3)'
            }}
          />
        </div>
      </div>

      <div className={styles.actions}>
        {event.status !== 'completed' && (
          <button
            className={`${styles.btn} ${isFull ? styles.btnDisabled : styles.btnPrimary}`}
            disabled={isFull}
            onClick={() => registerForEvent(event.id)}
          >
            {isFull ? 'Full' : 'Register'}
          </button>
        )}
        <button
          className={`${styles.btn} ${styles.btnGhost}`}
          onClick={() => navigate(`/events/${event.id}`)}
        >
          Details <ArrowRight size={13} />
        </button>
        {showDelete && (
          <button
            className={`${styles.btn} ${styles.btnDanger}`}
            onClick={() => deleteEvent(event.id)}
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>
    </div>
  )
}
