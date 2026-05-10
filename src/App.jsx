/**
 * App.jsx — Root Application Component
 * 
 * This is the top-level component that orchestrates:
 * 1. Global layout (Navbar + Footer wrapping all pages)
 * 2. Client-side routing via React Router
 * 3. Global modal state (Auth, City selector)
 * 4. Mobile sidebar state
 * 5. Theme & city preferences
 * 6. Page transition animations via AnimatePresence
 * 7. Toast notification system
 * 
 * All global UI state lives here and flows down via props.
 */

import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'

// Layout components — always visible on every page
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import MobileSidebar from './components/layout/MobileSidebar'

// Modal components — shown/hidden via state
import AuthModal from './components/modals/AuthModal'
import CityModal from './components/modals/CityModal'

// Page components — rendered by React Router
import HomePage from './pages/HomePage'
import MovieDetailsPage from './pages/MovieDetailsPage'
import SeatSelectionPage from './pages/SeatSelectionPage'
import CheckoutPage from './pages/CheckoutPage'
import ProfilePage from './pages/ProfilePage'
import BookingHistoryPage from './pages/BookingHistoryPage'
import SearchResultsPage from './pages/SearchResultsPage'

/**
 * ScrollToTop — Scrolls the window to the top on every route change.
 * Without this, navigating from a scrolled-down page would keep
 * the scroll position, which is jarring UX.
 */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

export default function App() {
  const location = useLocation()

  // ── Global UI State ──
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [cityModalOpen, setCityModalOpen] = useState(false)
  const [selectedCity, setSelectedCity] = useState('Mumbai')
  const [darkMode, setDarkMode] = useState(true)

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-white">
      {/* Scroll restoration on route changes */}
      <ScrollToTop />

      {/* Toast notification container — styled to match our dark theme */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '14px',
            fontSize: '13px',
            fontWeight: 500,
            padding: '12px 16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          },
        }}
      />

      {/* ── Persistent Layout: Navbar ── */}
      <Navbar
        onMenuClick={() => setSidebarOpen(true)}
        onSignInClick={() => setAuthModalOpen(true)}
        onCityClick={() => setCityModalOpen(true)}
        selectedCity={selectedCity}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />

      {/* ── Overlay Components: Sidebar & Modals ── */}
      <MobileSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSignInClick={() => { setSidebarOpen(false); setAuthModalOpen(true) }}
      />
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <CityModal
        isOpen={cityModalOpen}
        onClose={() => setCityModalOpen(false)}
        selectedCity={selectedCity}
        onSelectCity={(city) => { setSelectedCity(city); setCityModalOpen(false) }}
      />

      {/* ── Main Content: Route-based Pages ── */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            <Route path="/movie/:id" element={<MovieDetailsPage />} />
            <Route path="/seats/:id" element={<SeatSelectionPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/bookings" element={<BookingHistoryPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
          </Routes>
        </AnimatePresence>
      </main>

      {/* ── Persistent Layout: Footer ── */}
      <Footer />
    </div>
  )
}
