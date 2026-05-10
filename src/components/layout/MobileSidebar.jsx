import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { X, Film, Ticket, Trophy, Tv, Gift, User, Clock, Heart, Settings, LogOut } from 'lucide-react'

const menuItems = [
  { label: 'Movies', icon: Film, path: '/' },
  { label: 'Events', icon: Ticket, path: '/' },
  { label: 'Sports', icon: Trophy, path: '/' },
  { label: 'Stream', icon: Tv, path: '/' },
  { label: 'Offers', icon: Gift, path: '/' },
]

const accountItems = [
  { label: 'Profile', icon: User, path: '/profile' },
  { label: 'Booking History', icon: Clock, path: '/bookings' },
  { label: 'Watchlist', icon: Heart, path: '/profile' },
  { label: 'Settings', icon: Settings, path: '/profile' },
]

export default function MobileSidebar({ isOpen, onClose, onSignInClick }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-surface border-r border-border z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <Link to="/" onClick={onClose} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Film className="w-4 h-4 text-white" />
                </div>
                <span className="font-display font-bold text-lg">
                  Cine<span className="text-primary">Book</span>
                </span>
              </Link>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sign In Button */}
            <div className="p-4">
              <button
                onClick={onSignInClick}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-primary to-primary-dark rounded-xl font-semibold text-sm shadow-lg shadow-primary/20"
              >
                <User className="w-4 h-4" />
                Sign In / Register
              </button>
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto px-3">
              <div className="mb-6">
                <p className="px-3 py-2 text-xs font-semibold text-text-muted uppercase tracking-wider">Explore</p>
                {menuItems.map(({ label, icon: Icon, path }, i) => (
                  <motion.div key={label} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.05 * i }}>
                    <Link
                      to={path}
                      onClick={onClose}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-text-secondary hover:text-white hover:bg-white/5 transition-all"
                    >
                      <Icon className="w-5 h-5" />
                      {label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mb-6">
                <p className="px-3 py-2 text-xs font-semibold text-text-muted uppercase tracking-wider">Account</p>
                {accountItems.map(({ label, icon: Icon, path }, i) => (
                  <motion.div key={label} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 + 0.05 * i }}>
                    <Link
                      to={path}
                      onClick={onClose}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-text-secondary hover:text-white hover:bg-white/5 transition-all"
                    >
                      <Icon className="w-5 h-5" />
                      {label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border">
              <p className="text-xs text-text-muted text-center">© 2026 CineBook. All rights reserved.</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
