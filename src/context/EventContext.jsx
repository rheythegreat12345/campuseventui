import {
  createContext, useContext, useState, useEffect, useCallback
} from 'react'
import {
  collection, onSnapshot, addDoc, deleteDoc,
  doc, updateDoc, increment, serverTimestamp, query, orderBy
} from 'firebase/firestore'
import { db } from '../firebase'

const EventContext = createContext(null)

const SEED_EVENTS = [
  { title: 'ISPSC Foundation Day 2026', category: 'Celebration', date: '2026-04-28', time: '08:00', location: 'Main Gymnasium', description: 'Annual foundation day celebration with cultural shows, parade, and various competitions.', organizer: 'ISPSC Student Council', capacity: 500, registered: 342, status: 'upcoming', image: 'celebration', color: '#3b82f6' },
  { title: 'IT Summit 2026: AI & Emerging Tech', category: 'Academic', date: '2026-05-05', time: '09:00', location: 'ICT Building, Room 301', description: 'A full-day summit featuring talks on Artificial Intelligence, Web3, and the future of software development.', organizer: 'BSIT Department', capacity: 150, registered: 148, status: 'upcoming', image: 'academic', color: '#6366f1' },
  { title: 'Campus Sports Fest – Day 1', category: 'Sports', date: '2026-04-23', time: '07:00', location: 'College Grounds', description: 'Opening ceremony and first day of inter-department sports competitions.', organizer: 'PE Department', capacity: 800, registered: 652, status: 'live', image: 'sports', color: '#10b981' },
  { title: 'Research Colloquium – STEM', category: 'Academic', date: '2026-04-15', time: '13:00', location: 'Library AVR', description: 'Presentation of undergraduate and graduate research papers in science and technology.', organizer: 'Research Office', capacity: 80, registered: 80, status: 'completed', image: 'academic', color: '#f59e0b' },
  { title: 'Campus Clean-Up Drive', category: 'Community', date: '2026-05-10', time: '06:30', location: 'Entire Campus', description: 'Environmental awareness activity. Bring gloves and join us for a cleaner campus.', organizer: 'CESS', capacity: 300, registered: 87, status: 'upcoming', image: 'community', color: '#10b981' },
  { title: 'Culture & Arts Night', category: 'Cultural', date: '2026-05-15', time: '18:00', location: 'Open Amphitheater', description: 'Annual cultural night showcasing dance, music, and dramatic arts from every department.', organizer: 'Cultural Affairs Office', capacity: 600, registered: 210, status: 'upcoming', image: 'cultural', color: '#ec4899' },
]

export function EventProvider({ children }) {
  const [events, setEvents]               = useState([])
  const [loading, setLoading]             = useState(true)
  const [announcements, setAnnouncements] = useState([
    { id: 1, text: '🏅 Sports Fest Day 1 is LIVE now at the College Grounds!', time: new Date() },
    { id: 2, text: '📋 IT Summit registration closes May 2 – only 2 slots left!', time: new Date(Date.now() - 120000) },
    { id: 3, text: '🎉 Foundation Day committee meeting rescheduled to April 25', time: new Date(Date.now() - 360000) },
  ])
  const [liveStats, setLiveStats]         = useState({ totalAttendees: 1519, liveEvents: 1, upcomingToday: 3, newRegistrations: 0 })
  const [notifications, setNotifications] = useState([])
  const [lastUpdated, setLastUpdated]     = useState(new Date())
  const [seeded, setSeeded]               = useState(false)

  // Real-time Firestore listener
  useEffect(() => {
    const q = query(collection(db, 'events'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, async (snap) => {
      if (snap.empty && !seeded) {
        setSeeded(true)
        for (const ev of SEED_EVENTS) {
          await addDoc(collection(db, 'events'), { ...ev, createdAt: serverTimestamp() })
        }
        return
      }
      setEvents(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLastUpdated(new Date())
      setLoading(false)
    }, (err) => { console.error('Firestore error:', err); setLoading(false) })
    return () => unsub()
  }, [seeded])

  // Cosmetic live stats ticker
  useEffect(() => {
    const iv = setInterval(() => {
      setLiveStats(prev => ({
        ...prev,
        totalAttendees: prev.totalAttendees + Math.floor(Math.random() * 3),
        newRegistrations: prev.newRegistrations + (Math.random() > 0.6 ? 1 : 0),
      }))
    }, 5000)
    return () => clearInterval(iv)
  }, [])

  // Cosmetic announcements ticker
  useEffect(() => {
    const msgs = [
      '🏐 Volleyball – IT beats BA Department 25-18!',
      '🏀 Basketball quarterfinals starting at 10:00 AM',
      '🎤 IT Summit speaker Dr. Reyes has arrived on campus',
      '⚠️ Sports Fest: Water stations set up at Gate 2 and 3',
      '📣 Foundation Day rehearsal moved to April 26',
    ]
    let idx = 0
    const iv = setInterval(() => {
      const text = msgs[idx % msgs.length]
      setAnnouncements(prev => [{ id: Date.now(), text, time: new Date() }, ...prev.slice(0, 9)])
      addNotification(text)
      idx++
    }, 12000)
    return () => clearInterval(iv)
  }, [])

  const addNotification = useCallback((msg) => {
    const id = Date.now()
    setNotifications(prev => [{ id, msg }, ...prev.slice(0, 4)])
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 5000)
  }, [])

  const addEvent = useCallback(async (event) => {
    await addDoc(collection(db, 'events'), {
      ...event,
      capacity: Number(event.capacity),
      registered: 0,
      status: 'upcoming',
      createdAt: serverTimestamp(),
    })
    addNotification(`✅ New event added: "${event.title}"`)
    setAnnouncements(prev => [
      { id: Date.now(), text: `📢 New event posted: "${event.title}" on ${event.date}`, time: new Date() },
      ...prev,
    ])
  }, [addNotification])

  const deleteEvent = useCallback(async (id) => {
    const event = events.find(e => e.id === id)
    await deleteDoc(doc(db, 'events', id))
    if (event) addNotification(`🗑️ Event removed: "${event.title}"`)
  }, [events, addNotification])

  const registerForEvent = useCallback(async (id) => {
    const event = events.find(e => e.id === id)
    if (!event || event.registered >= event.capacity) return
    await updateDoc(doc(db, 'events', id), { registered: increment(1) })
    if (event) addNotification(`🎟️ You registered for "${event.title}"`)
  }, [events, addNotification])

  return (
    <EventContext.Provider value={{
      events, announcements, liveStats, notifications,
      lastUpdated, loading, addEvent, deleteEvent, registerForEvent,
    }}>
      {children}
    </EventContext.Provider>
  )
}

export const useEvents = () => useContext(EventContext)
