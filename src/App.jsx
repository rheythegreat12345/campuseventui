import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { EventProvider } from './context/EventContext'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import PrivateRoute from './components/PrivateRoute'
import Landing from './pages/Landing'
import Login from './pages/Login'

// Lazy loaded pages
const Home = lazy(() => import('./pages/Home'))
const Events = lazy(() => import('./pages/Events'))
const EventDetail = lazy(() => import('./pages/EventDetail'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const AddEvent = lazy(() => import('./pages/AddEvent'))

function PageLoader() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '60vh',
      color: 'var(--text3)',
      fontSize: '14px',
      gap: '10px'
    }}>
      <span>⏳</span> Loading...
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <EventProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Landing & Login - no layout */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />

              {/* Public pages - sidebar: Home + Events only */}
              <Route path="/home" element={<Layout><Home /></Layout>} />
              <Route path="/events" element={<Layout><Events /></Layout>} />
              <Route path="/events/:id" element={<Layout><EventDetail /></Layout>} />

              {/* Admin pages - separate sidebar with Dashboard + Add Event */}
              <Route
                path="/admin/dashboard"
                element={
                  <PrivateRoute>
                    <Layout isAdmin><Dashboard /></Layout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/add-event"
                element={
                  <PrivateRoute>
                    <Layout isAdmin><AddEvent /></Layout>
                  </PrivateRoute>
                }
              />

              {/* Redirect old routes */}
              <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/add-event" element={<Navigate to="/admin/add-event" replace />} />
            </Routes>
          </Suspense>
        </EventProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
