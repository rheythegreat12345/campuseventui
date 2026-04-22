import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEvents } from '../context/EventContext'
import { PlusCircle, CheckCircle } from 'lucide-react'
import styles from './AddEvent.module.css'

const CATEGORIES = ['Academic', 'Sports', 'Cultural', 'Community', 'Celebration']
const COLORS = ['#3b82f6', '#6366f1', '#10b981', '#f59e0b', '#ec4899', '#ef4444']

const EMPTY = {
  title: '', category: 'Academic', date: '', time: '',
  location: '', description: '', organizer: '', capacity: '',
  color: '#3b82f6',
}

export default function AddEvent() {
  const { addEvent } = useEvents()
  const navigate = useNavigate()
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Title is required'
    if (!form.date) e.date = 'Date is required'
    if (!form.time) e.time = 'Time is required'
    if (!form.location.trim()) e.location = 'Location is required'
    if (!form.organizer.trim()) e.organizer = 'Organizer is required'
    if (!form.capacity || isNaN(form.capacity) || Number(form.capacity) < 1) e.capacity = 'Valid capacity required'
    if (!form.description.trim()) e.description = 'Description is required'
    return e
  }

  const handleSubmit = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    addEvent({ ...form, capacity: Number(form.capacity) })
    setSuccess(true)
    setTimeout(() => navigate('/events'), 1800)
  }

  if (success) return (
    <div className={styles.success}>
      <CheckCircle size={52} color="var(--accent3)" />
      <h2>Event Added!</h2>
      <p>Redirecting to Events...</p>
    </div>
  )

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Add New Event</h1>
        <p className={styles.sub}>Fill in the details to post a new campus event.</p>
      </div>

      <div className={styles.form}>
        <div className={styles.row}>
          <Field label="Event Title" error={errors.title}>
            <input
              className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
              placeholder="e.g. ISPSC Foundation Day 2026"
              value={form.title}
              onChange={e => set('title', e.target.value)}
            />
          </Field>
          <Field label="Category">
            <select className={styles.input} value={form.category} onChange={e => set('category', e.target.value)}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </Field>
        </div>

        <div className={styles.row}>
          <Field label="Date" error={errors.date}>
            <input type="date" className={`${styles.input} ${errors.date ? styles.inputError : ''}`} value={form.date} onChange={e => set('date', e.target.value)} />
          </Field>
          <Field label="Time" error={errors.time}>
            <input type="time" className={`${styles.input} ${errors.time ? styles.inputError : ''}`} value={form.time} onChange={e => set('time', e.target.value)} />
          </Field>
          <Field label="Capacity" error={errors.capacity}>
            <input type="number" min="1" className={`${styles.input} ${errors.capacity ? styles.inputError : ''}`} placeholder="e.g. 200" value={form.capacity} onChange={e => set('capacity', e.target.value)} />
          </Field>
        </div>

        <Field label="Location" error={errors.location}>
          <input className={`${styles.input} ${errors.location ? styles.inputError : ''}`} placeholder="e.g. ICT Building, Room 301" value={form.location} onChange={e => set('location', e.target.value)} />
        </Field>

        <Field label="Organizer" error={errors.organizer}>
          <input className={`${styles.input} ${errors.organizer ? styles.inputError : ''}`} placeholder="e.g. BSIT Department" value={form.organizer} onChange={e => set('organizer', e.target.value)} />
        </Field>

        <Field label="Description" error={errors.description}>
          <textarea
            className={`${styles.input} ${styles.textarea} ${errors.description ? styles.inputError : ''}`}
            placeholder="Brief description of the event..."
            value={form.description}
            onChange={e => set('description', e.target.value)}
            rows={4}
          />
        </Field>

        <Field label="Card Color">
          <div className={styles.colors}>
            {COLORS.map(c => (
              <button
                key={c}
                className={`${styles.colorBtn} ${form.color === c ? styles.colorSelected : ''}`}
                style={{ background: c }}
                onClick={() => set('color', c)}
              />
            ))}
          </div>
        </Field>

        <div className={styles.formActions}>
          <button className={styles.cancelBtn} onClick={() => navigate('/events')}>Cancel</button>
          <button className={styles.submitBtn} onClick={handleSubmit}>
            <PlusCircle size={16} /> Add Event
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, error, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</label>
      {children}
      {error && <span style={{ fontSize: 11, color: 'var(--danger)' }}>{error}</span>}
    </div>
  )
}
