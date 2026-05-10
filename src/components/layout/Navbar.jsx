import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import {
  Search, Menu, MapPin, User, Sun, Moon,
  Film, Ticket, Trophy, Tv, Gift, X, ChevronDown
} from 'lucide-react'
import { movies } from '../../data/mockData'

const navLinks = [
  { label: 'Movies', icon: Film, path: '/' },
  { label: 'Events', icon: Ticket, path: '/' },
  { label: 'Sports', icon: Trophy, path: '/' },
  { label: 'Stream', icon: Tv, path: '/' },
  { label: 'Offers', icon: Gift, path: '/' },
]

export default function Navbar({ onMenuClick, onSignInClick, onCityClick, selectedCity, darkMode, onToggleDarkMode }) {
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const searchRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (searchQuery.length > 0) {
      const filtered = movies.filter(m =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.genre.some(g => g.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      setSuggestions(filtered.slice(0, 5))
    } else {
      setSuggestions([])
    }
  }, [searchQuery])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/5 shadow-2xl'
          : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Left: Menu + Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 hover:bg-white/10 rounded-xl transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-shadow">
                <Film className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight hidden sm:block">
                Cine<span className="text-primary">Book</span>
              </span>
            </Link>
          </div>

          {/* Center: Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(({ label, icon: Icon, path }) => (
              <Link
                key={label}
                to={path}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-text-secondary hover:text-white hover:bg-white/5 transition-all duration-300"
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </div>

          {/* Right: Search, City, Theme, SignIn */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div ref={searchRef} className="relative">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              <AnimatePresence>
                {searchOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute right-0 top-12 w-80 sm:w-96 glass rounded-2xl overflow-hidden shadow-2xl"
                  >
                    <form onSubmit={handleSearch} className="flex items-center gap-2 p-3 border-b border-border">
                      <Search className="w-4 h-4 text-text-muted flex-shrink-0" />
                      <input
                        autoFocus
                        type="text"
                        placeholder="Search movies, events, genres..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 bg-transparent outline-none text-sm placeholder:text-text-muted"
                      />
                      {searchQuery && (
                        <button type="button" onClick={() => setSearchQuery('')} className="p-1 hover:bg-white/10 rounded-lg">
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </form>
                    {suggestions.length > 0 && (
                      <div className="p-2 max-h-80 overflow-y-auto">
                        {suggestions.map((movie) => (
                          <Link
                            key={movie.id}
                            to={`/movie/${movie.id}`}
                            onClick={() => { setSearchOpen(false); setSearchQuery('') }}
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors"
                          >
                            <img src={movie.poster} alt={movie.title} className="w-10 h-14 rounded-lg object-cover" />
                            <div>
                              <p className="text-sm font-medium">{movie.title}</p>
                              <p className="text-xs text-text-muted">{movie.genre.slice(0, 2).join(' • ')} • {movie.language}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                    {searchQuery && suggestions.length === 0 && (
                      <div className="p-6 text-center text-text-muted text-sm">No results found</div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* City Selector */}
            <button
              onClick={onCityClick}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-white/5 transition-colors text-sm"
            >
              <MapPin className="w-4 h-4 text-primary" />
              <span className="font-medium">{selectedCity}</span>
              <ChevronDown className="w-3 h-3 text-text-muted" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Sign In */}
            <button
              onClick={onSignInClick}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-light hover:to-primary rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300"
            >
              <User className="w-4 h-4" />
              Sign In
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
