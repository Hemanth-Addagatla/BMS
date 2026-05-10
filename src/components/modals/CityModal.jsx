import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Search } from 'lucide-react'
import { useState } from 'react'
import { cities } from '../../data/mockData'

const popularCities = cities.slice(0, 8)
const cityEmojis = {
  Mumbai: '🏙️', Delhi: '🕌', Bangalore: '💻', Hyderabad: '🍗',
  Chennai: '🎭', Kolkata: '🌉', Pune: '⛰️', Ahmedabad: '🛕',
  Jaipur: '🏰', Lucknow: '🍽️', Kochi: '🌴', Chandigarh: '🌳',
  Goa: '🏖️', Indore: '🍔', Vadodara: '🏛️',
}

export default function CityModal({ isOpen, onClose, selectedCity, onSelectCity }) {
  const [search, setSearch] = useState('')
  const filtered = cities.filter(c => c.toLowerCase().includes(search.toLowerCase()))

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[80]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 flex items-center justify-center z-[90] p-4"
          >
            <div className="w-full max-w-lg glass rounded-3xl overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between p-6 pb-3">
                <div>
                  <h2 className="text-xl font-display font-bold">Select City</h2>
                  <p className="text-sm text-text-secondary mt-0.5">Choose your location for shows near you</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search */}
              <div className="px-6 pb-4">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-border rounded-xl">
                  <Search className="w-4 h-4 text-text-muted" />
                  <input
                    type="text"
                    placeholder="Search city..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-sm placeholder:text-text-muted"
                  />
                </div>
              </div>

              {/* Popular Cities */}
              {!search && (
                <div className="px-6 pb-4">
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Popular Cities</p>
                  <div className="grid grid-cols-4 gap-2">
                    {popularCities.map((city) => (
                      <button
                        key={city}
                        onClick={() => onSelectCity(city)}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all duration-300 ${
                          selectedCity === city
                            ? 'bg-primary/20 border border-primary/30'
                            : 'hover:bg-white/5 border border-transparent'
                        }`}
                      >
                        <span className="text-2xl">{cityEmojis[city]}</span>
                        <span className="text-xs font-medium">{city}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* All Cities */}
              <div className="px-6 pb-6 max-h-48 overflow-y-auto">
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                  {search ? 'Results' : 'All Cities'}
                </p>
                <div className="grid grid-cols-2 gap-1">
                  {filtered.map((city) => (
                    <button
                      key={city}
                      onClick={() => onSelectCity(city)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                        selectedCity === city
                          ? 'text-primary bg-primary/10'
                          : 'text-text-secondary hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      {city}
                    </button>
                  ))}
                </div>
                {filtered.length === 0 && (
                  <p className="text-center py-6 text-text-muted text-sm">No cities found</p>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
