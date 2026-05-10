/**
 * SeatSelectionPage.jsx — Interactive Theater Seat Map
 *
 * This is one of the most complex UI components in the app.
 * It renders a theater-style seat layout with:
 * - 12 rows (A through M, skipping I)
 * - 3 tiers: VIP Recliner (top), Premium (middle), Standard (bottom)
 * - Aisle gaps in the middle of each row
 * - Random occupied seats (simulated)
 * - Click-to-select with real-time price calculation
 * - Floating bottom bar showing selected seats + total
 *
 * How seat generation works:
 * 1. generateSeats() creates 12 rows with varying seat counts
 * 2. First 2 rows → VIP (18 seats, ₹600 each)
 * 3. Rows 3-8 → Premium (20 seats, ₹400 each)
 * 4. Rows 9-12 → Standard (22 seats, ₹250 each)
 * 5. ~30% of seats are randomly marked as "occupied"
 * 6. Aisle positions are calculated based on row size
 *
 * State:
 * - seatLayout: generated once on mount (useState with initializer)
 * - selectedSeats: array of selected seat objects
 *
 * Navigation:
 * - "Proceed to Pay" navigates to /checkout with state containing
 *   movie, seats, total, theater, showtime, and date data
 */

import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useMemo } from 'react'
import { Crown, Monitor, Info } from 'lucide-react'
import { movies } from '../data/mockData'
import Button from '../components/ui/Button'

const pageV = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0 },
}

/* ─── Seat tier pricing ─── */
const SEAT_TYPES = {
  standard: { label: 'Standard', price: 250, color: 'emerald' },
  premium: { label: 'Premium', price: 400, color: 'blue' },
  vip: { label: 'VIP Recliner', price: 600, color: 'amber' },
}

/**
 * Generates the complete seat layout for the theater.
 * Called once as a useState initializer (never re-generated).
 */
function generateSeats() {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M']
  return rows.map((row, ri) => {
    const cnt = ri < 2 ? 18 : ri < 8 ? 20 : 22
    const type = ri < 2 ? 'vip' : ri < 8 ? 'premium' : 'standard'
    const seats = []

    for (let i = 1; i <= cnt; i++) {
      // Aisle gaps — positioned at ~1/4 and ~3/4 of the row
      const isAisle =
        (cnt <= 18 && (i === 5 || i === 14)) ||
        (cnt === 20 && (i === 6 || i === 15)) ||
        (cnt === 22 && (i === 6 || i === 17))

      seats.push({
        id: `${row}${i}`,
        row,
        number: i,
        type,
        state: Math.random() < 0.3 ? 'occupied' : 'available',
        isAisle,
        price: SEAT_TYPES[type].price,
      })
    }
    return { row, type, seats }
  })
}

export default function SeatSelectionPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const movie = movies.find(m => m.id === Number(id)) || movies[0]

  // Seat state
  const [seatLayout] = useState(generateSeats)
  const [selectedSeats, setSelectedSeats] = useState([])

  // Toggle seat selection
  const toggleSeat = (seat) => {
    if (seat.state === 'occupied') return
    setSelectedSeats(prev =>
      prev.find(s => s.id === seat.id)
        ? prev.filter(s => s.id !== seat.id)
        : [...prev, seat]
    )
  }

  // Calculate total from selected seats
  const totalPrice = useMemo(
    () => selectedSeats.reduce((sum, s) => sum + s.price, 0),
    [selectedSeats]
  )

  /**
   * Returns Tailwind classes for a seat based on its state + type.
   * Selected seats get the red primary color with a glow effect.
   */
  const getSeatColor = (seat) => {
    if (seat.state === 'occupied')
      return 'bg-white/[0.03] text-white/15 cursor-not-allowed'

    if (selectedSeats.find(s => s.id === seat.id))
      return 'bg-primary text-white shadow-lg shadow-primary/30 scale-110 ring-1 ring-primary/50'

    if (seat.type === 'vip')
      return 'bg-amber-500/15 text-amber-400 border border-amber-500/20 hover:bg-amber-500/25'

    if (seat.type === 'premium')
      return 'bg-blue-500/15 text-blue-400 border border-blue-500/20 hover:bg-blue-500/25'

    return 'bg-white/6 text-white/50 border border-white/6 hover:bg-white/12'
  }

  return (
    <motion.div variants={pageV} initial="initial" animate="animate" exit="exit" className="pt-20 pb-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-xl sm:text-2xl md:text-3xl font-display font-bold mb-1.5">
            {movie.title}
          </h1>
          <p className="text-white/40 text-xs sm:text-sm">
            PVR IMAX — Phoenix Mall • Today, 07:45 PM • IMAX 2D
          </p>
        </motion.div>

        {/* ── Screen Indicator ── */}
        <div className="relative mb-10">
          <div className="mx-auto max-w-md sm:max-w-lg">
            <div className="h-1.5 bg-gradient-to-r from-transparent via-primary/60 to-transparent rounded-full mb-1.5" />
            <div className="h-6 bg-gradient-to-b from-primary/8 to-transparent rounded-b-[100%]" />
            <p className="text-center text-[10px] text-white/25 flex items-center justify-center gap-1 -mt-0.5">
              <Monitor className="w-3 h-3" /> SCREEN
            </p>
          </div>
        </div>

        {/* ── Seat Layout (horizontally scrollable on small screens) ── */}
        <div className="overflow-x-auto no-scrollbar mb-8">
          <div className="min-w-[680px] max-w-4xl mx-auto">
            {seatLayout.map((row, ri) => (
              <div key={row.row}>
                {/* Tier Dividers */}
                {ri === 0 && (
                  <div className="flex items-center gap-2 mb-3 px-8">
                    <div className="flex-1 h-px bg-amber-500/15" />
                    <span className="text-[9px] text-amber-400 font-semibold tracking-[0.15em] flex items-center gap-1">
                      <Crown className="w-3 h-3" />VIP RECLINER — ₹600
                    </span>
                    <div className="flex-1 h-px bg-amber-500/15" />
                  </div>
                )}
                {ri === 2 && (
                  <div className="flex items-center gap-2 my-3 px-8">
                    <div className="flex-1 h-px bg-blue-500/15" />
                    <span className="text-[9px] text-blue-400 font-semibold tracking-[0.15em]">PREMIUM — ₹400</span>
                    <div className="flex-1 h-px bg-blue-500/15" />
                  </div>
                )}
                {ri === 8 && (
                  <div className="flex items-center gap-2 my-3 px-8">
                    <div className="flex-1 h-px bg-emerald-500/15" />
                    <span className="text-[9px] text-emerald-400 font-semibold tracking-[0.15em]">STANDARD — ₹250</span>
                    <div className="flex-1 h-px bg-emerald-500/15" />
                  </div>
                )}

                {/* Seat Row */}
                <div className="flex items-center gap-[3px] mb-[5px] justify-center">
                  {/* Row label (left) */}
                  <span className="w-5 text-[10px] text-white/25 font-mono text-right mr-1.5 flex-shrink-0">
                    {row.row}
                  </span>

                  {/* Individual seats */}
                  {row.seats.map(seat => (
                    <div key={seat.id} className="flex items-center">
                      {seat.isAisle && <div className="w-3 sm:w-4" />}
                      <motion.button
                        whileHover={{ scale: seat.state !== 'occupied' ? 1.12 : 1 }}
                        whileTap={{ scale: seat.state !== 'occupied' ? 0.9 : 1 }}
                        onClick={() => toggleSeat(seat)}
                        disabled={seat.state === 'occupied'}
                        className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-md text-[8px] sm:text-[9px] md:text-[10px] font-semibold flex items-center justify-center transition-all duration-200 ${getSeatColor(seat)}`}
                      >
                        {seat.number}
                      </motion.button>
                    </div>
                  ))}

                  {/* Row label (right) */}
                  <span className="w-5 text-[10px] text-white/25 font-mono ml-1.5 flex-shrink-0">
                    {row.row}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Seat Legend ── */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 mb-6">
          {[
            ['bg-white/6 border border-white/6', 'Available'],
            ['bg-primary shadow-lg shadow-primary/30', 'Selected'],
            ['bg-white/[0.03]', 'Occupied'],
            ['bg-amber-500/15 border border-amber-500/20', 'VIP ₹600'],
            ['bg-blue-500/15 border border-blue-500/20', 'Premium ₹400'],
          ].map(([cls, lbl]) => (
            <div key={lbl} className="flex items-center gap-1.5">
              <div className={`w-5 h-5 rounded-md ${cls}`} />
              <span className="text-[10px] sm:text-xs text-white/40">{lbl}</span>
            </div>
          ))}
        </div>

        {/* ── Tip ── */}
        <p className="text-center text-[10px] text-white/20 flex items-center justify-center gap-1">
          <Info className="w-3 h-3" /> Tap on seats to select. Scroll horizontally on mobile.
        </p>
      </div>

      {/* ═══════ Floating Bottom Bar ═══════ */}
      <AnimatePresence>
        {selectedSeats.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 24, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-40"
          >
            <div className="glass border-t border-white/8 shadow-2xl shadow-black/50">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 sm:py-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Selected seat chips */}
                    <div className="flex flex-wrap gap-1.5 mb-1.5">
                      {selectedSeats.map(s => (
                        <motion.span
                          key={s.id}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="px-2 py-0.5 bg-primary/15 text-primary text-[10px] sm:text-xs font-semibold rounded-lg border border-primary/15"
                        >
                          {s.id}
                        </motion.span>
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm text-white/50">
                      {selectedSeats.length} Ticket{selectedSeats.length > 1 ? 's' : ''} •{' '}
                      <span className="text-white font-bold text-base sm:text-lg">
                        ₹{totalPrice.toLocaleString()}
                      </span>
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() =>
                      navigate('/checkout', {
                        state: {
                          movie,
                          seats: selectedSeats,
                          total: totalPrice,
                          theater: 'PVR IMAX — Phoenix Mall',
                          showtime: '07:45 PM',
                          date: 'Today',
                        },
                      })
                    }
                  >
                    Proceed to Pay
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
