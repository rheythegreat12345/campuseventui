import { useState } from 'react'
import { useEvents } from '../context/EventContext'
import { Users, Calendar, Activity, TrendingUp, CheckCircle, Clock, Zap, Trash2 } from 'lucide-react'
import styles from './Dashboard.module.css'

const STATUS_COLORS = { live: 'var(--accent3)', upcoming: 'var(--accent)', completed: 'var(--text3)' }
const CATEGORY_EMOJI = { Academic: '📚', Sports: '🏅', Cultural: '🎭', Community: '🌿', Celebration: '🎉' }

export default function Dashboard() {
  const { events, liveStats, deleteEvent } = useEvents()
  const [confirmId, setConfirmId] = useState(null)

  const totalEvents     = events.length
  const liveCount       = events.filter(e => e.status === 'live').length
  const upcomingCount   = events.filter(e => e.status === 'upcoming').length
  const completedCount  = events.filter(e => e.status === 'completed').length
  const totalRegistered = events.reduce((s, e) => s + (e.registered || 0), 0)
  const totalCapacity   = events.reduce((s, e) => s + (e.capacity || 0), 0)
  const avgFill         = totalCapacity > 0 ? Math.round((totalRegistered / totalCapacity) * 100) : 0

  const categoryBreakdown = events.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + 1
    return acc
  }, {})

  const topEvents = [...events]
    .sort((a, b) => b.registered / b.capacity - a.registered / a.capacity)
    .slice(0, 5)

  const handleDelete = (id) => {
    deleteEvent(id)
    setConfirmId(null)
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.sub}>Real-time overview of campus events</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <KPI icon={Calendar}   label="Total Events"       value={totalEvents}                        color="var(--accent)"  />
        <KPI icon={Activity}   label="Live Now"           value={liveCount}                          color="var(--accent3)" glow />
        <KPI icon={Clock}      label="Upcoming"           value={upcomingCount}                      color="var(--accent2)" />
        <KPI icon={CheckCircle}label="Completed"          value={completedCount}                     color="var(--text3)"   />
        <KPI icon={Users}      label="Total Registered"   value={totalRegistered.toLocaleString()}   color="var(--warning)" />
        <KPI icon={TrendingUp} label="Avg. Fill Rate"     value={`${avgFill}%`}                      color="var(--accent)"  />
        <KPI icon={Zap}        label="New Registrations"  value={liveStats.newRegistrations}         color="var(--accent3)" glow />
        <KPI icon={Users}      label="Total Attendees"    value={liveStats.totalAttendees.toLocaleString()} color="var(--accent2)" />
      </div>

      <div className={styles.twoCol}>
        {/* Fill Rate per Event */}
        <div className={styles.panel}>
          <h2 className={styles.panelTitle}>Registration Fill Rate</h2>
          <div className={styles.barChart}>
            {topEvents.map(e => {
              const pct = Math.round(((e.registered || 0) / (e.capacity || 1)) * 100)
              return (
                <div key={e.id} className={styles.barRow}>
                  <div className={styles.barLabel}>{e.title.length > 28 ? e.title.slice(0, 28) + '…' : e.title}</div>
                  <div className={styles.barTrack}>
                    <div className={styles.barFill} style={{ width: `${pct}%`, background: pct >= 100 ? 'var(--danger)' : pct > 70 ? 'var(--warning)' : 'var(--accent3)', transition: 'width 0.8s ease' }} />
                  </div>
                  <div className={styles.barPct} style={{ color: pct >= 100 ? 'var(--danger)' : pct > 70 ? 'var(--warning)' : 'var(--accent3)' }}>{pct}%</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Category breakdown */}
        <div className={styles.panel}>
          <h2 className={styles.panelTitle}>Events by Category</h2>
          <div className={styles.catList}>
            {Object.entries(categoryBreakdown).map(([cat, count]) => {
              const pct = Math.round((count / totalEvents) * 100)
              const colors = { Academic: '#6366f1', Sports: '#10b981', Cultural: '#ec4899', Community: '#10b981', Celebration: '#3b82f6' }
              return (
                <div key={cat} className={styles.catRow}>
                  <div className={styles.catDot} style={{ background: colors[cat] || 'var(--accent)' }} />
                  <div className={styles.catName}>{cat}</div>
                  <div className={styles.catBar}><div className={styles.catBarFill} style={{ width: `${pct}%`, background: colors[cat] || 'var(--accent)' }} /></div>
                  <div className={styles.catCount}>{count}</div>
                </div>
              )
            })}
          </div>
          <div className={styles.statusSummary}>
            <div className={styles.statusItem}><span className={styles.dot} style={{ background: 'var(--accent3)' }} /><span>Live</span><strong>{liveCount}</strong></div>
            <div className={styles.statusItem}><span className={styles.dot} style={{ background: 'var(--accent)' }} /><span>Upcoming</span><strong>{upcomingCount}</strong></div>
            <div className={styles.statusItem}><span className={styles.dot} style={{ background: 'var(--text3)' }} /><span>Completed</span><strong>{completedCount}</strong></div>
          </div>
        </div>
      </div>

      {/* ── Manage Events Table ─────────────────────────────────────── */}
      <div className={styles.panel}>
        <h2 className={styles.panelTitle}>Manage Events</h2>
        <div className={styles.manageTable}>
          <div className={styles.tableHead}>
            <span>Event</span>
            <span>Category</span>
            <span>Date</span>
            <span>Status</span>
            <span>Fill</span>
            <span>Action</span>
          </div>
          {events.length === 0 && (
            <div className={styles.emptyRow}>No events found.</div>
          )}
          {events.map(e => {
            const pct = Math.round(((e.registered || 0) / (e.capacity || 1)) * 100)
            const isConfirming = confirmId === e.id
            return (
              <div key={e.id} className={`${styles.tableRow} ${isConfirming ? styles.tableRowConfirm : ''}`}>
                <span className={styles.eventName}>
                  {CATEGORY_EMOJI[e.category] || '📌'} {e.title}
                </span>
                <span className={styles.catTag}>{e.category}</span>
                <span className={styles.dateCell}>{e.date}</span>
                <span>
                  <span className={styles.statusBadge} style={{ background: STATUS_COLORS[e.status] + '22', color: STATUS_COLORS[e.status] }}>
                    {e.status}
                  </span>
                </span>
                <span className={styles.fillCell} style={{ color: pct >= 100 ? 'var(--danger)' : pct > 70 ? 'var(--warning)' : 'var(--accent3)' }}>
                  {pct}%
                </span>
                <span className={styles.actionCell}>
                  {!isConfirming ? (
                    <button className={styles.deleteBtn} onClick={() => setConfirmId(e.id)}>
                      <Trash2 size={13} /> Remove
                    </button>
                  ) : (
                    <div className={styles.confirmRow}>
                      <span className={styles.confirmText}>Sure?</span>
                      <button className={styles.confirmYes} onClick={() => handleDelete(e.id)}>Yes</button>
                      <button className={styles.confirmNo}  onClick={() => setConfirmId(null)}>No</button>
                    </div>
                  )}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Confirm Modal Overlay (optional extra safety) */}
    </div>
  )
}

function KPI({ icon: Icon, label, value, color, glow }) {
  return (
    <div className={`${styles.kpi} ${glow ? styles.kpiGlow : ''}`} style={{ '--color': color }}>
      <div className={styles.kpiIcon}><Icon size={17} /></div>
      <div className={styles.kpiVal}>{value}</div>
      <div className={styles.kpiLabel}>{label}</div>
    </div>
  )
}