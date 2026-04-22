import { useParams, useNavigate } from 'react-router-dom'
import { useEvents } from '../context/EventContext'
import { Calendar, MapPin, Users, ArrowLeft, UserCheck, Building } from 'lucide-react'
import styles from './EventDetail.module.css'

export default function EventDetail() {
  const { id } = useParams()
  const { events, registerForEvent, deleteEvent } = useEvents()
  const navigate = useNavigate()

  const event = events.find(e => e.id === id)
  if (!event) return (
    <div className={styles.notFound}>
      <h2>Event not found.</h2>
      <button onClick={() => navigate('/events')}>← Back to Events</button>
    </div>
  )

  const pct = Math.round((event.registered / event.capacity) * 100)
  const isFull = event.registered >= event.capacity

  return (
    <div className={styles.page}>
      <button className={styles.back} onClick={() => navigate(-1)}>
        <ArrowLeft size={15} /> Back
      </button>

      <div className={styles.card}>
        <div className={styles.cardTop} style={{ '--color': event.color }}>
          <div className={styles.topRow}>
            <span className={`${styles.status} ${styles[event.status]}`}>
              {event.status === 'live' && <span className="live-dot" style={{ width: 6, height: 6 }} />}
              {event.status.toUpperCase()}
            </span>
            <span className={styles.category}>{event.category}</span>
          </div>
          <h1 className={styles.title}>{event.title}</h1>
        </div>

        <div className={styles.body}>
          <div className={styles.mainInfo}>
            <p className={styles.desc}>{event.description}</p>

            <div className={styles.metaGrid}>
              <div className={styles.metaItem}>
                <Calendar size={16} />
                <div>
                  <div className={styles.metaLabel}>Date & Time</div>
                  <div className={styles.metaVal}>
                    {new Date(event.date).toLocaleDateString('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} · {event.time}
                  </div>
                </div>
              </div>
              <div className={styles.metaItem}>
                <MapPin size={16} />
                <div>
                  <div className={styles.metaLabel}>Location</div>
                  <div className={styles.metaVal}>{event.location}</div>
                </div>
              </div>
              <div className={styles.metaItem}>
                <Building size={16} />
                <div>
                  <div className={styles.metaLabel}>Organizer</div>
                  <div className={styles.metaVal}>{event.organizer}</div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.sidebar}>
            <div className={styles.regCard}>
              <h3>Registration</h3>
              <div className={styles.regStats}>
                <div className={styles.regNum}>{event.registered}</div>
                <div className={styles.regDenom}>/ {event.capacity} seats</div>
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
              <div className={styles.pctLabel}>{pct}% full</div>

              {event.status !== 'completed' && (
                <button
                  className={`${styles.regBtn} ${isFull ? styles.regBtnDisabled : styles.regBtnActive}`}
                  disabled={isFull}
                  onClick={() => registerForEvent(event.id)}
                >
                  <UserCheck size={15} />
                  {isFull ? 'Event is Full' : 'Register Now'}
                </button>
              )}
            </div>

            <button className={styles.deleteBtn} onClick={() => { deleteEvent(event.id); navigate('/events') }}>
              🗑️ Remove Event
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
