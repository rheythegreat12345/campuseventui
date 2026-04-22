import { useState, useMemo } from 'react'
import { useEvents } from '../context/EventContext'
import EventCard from '../components/EventCard'
import { Search, Filter } from 'lucide-react'
import styles from './Events.module.css'

const CATEGORIES = ['All', 'Academic', 'Sports', 'Cultural', 'Community', 'Celebration']
const STATUSES = ['All', 'live', 'upcoming', 'completed']

export default function Events() {
  const { events } = useEvents()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [status, setStatus] = useState('All')

  const filtered = useMemo(() => events.filter(e => {
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.description.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'All' || e.category === category
    const matchStatus = status === 'All' || e.status === status
    return matchSearch && matchCat && matchStatus
  }), [events, search, category, status])

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>All Events</h1>
          <p className={styles.sub}>{filtered.length} event{filtered.length !== 1 ? 's' : ''} found</p>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.searchWrap}>
          <Search size={15} className={styles.searchIcon} />
          <input
            className={styles.search}
            placeholder="Search events, locations..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.filterGroup}>
          <Filter size={14} style={{ color: 'var(--text3)' }} />
          <div className={styles.chips}>
            {CATEGORIES.map(c => (
              <button
                key={c}
                className={`${styles.chip} ${category === c ? styles.chipActive : ''}`}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.filterGroup}>
          <div className={styles.chips}>
            {STATUSES.map(s => (
              <button
                key={s}
                className={`${styles.chip} ${status === s ? styles.chipActive : ''} ${styles[`chip_${s}`]}`}
                onClick={() => setStatus(s)}
              >
                {s === 'live' ? '🔴 Live' : s === 'upcoming' ? '🔵 Upcoming' : s === 'completed' ? '⚫ Completed' : 'All Status'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <span>🔍</span>
          <p>No events match your search.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map(e => <EventCard key={e.id} event={e} />)}
        </div>
      )}


    </div>
  )
}