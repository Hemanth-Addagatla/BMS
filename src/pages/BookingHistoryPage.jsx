/**
 * BookingHistoryPage.jsx — Past & Upcoming Bookings
 *
 * Displays all user bookings with:
 * - Stats overview (total, completed, upcoming)
 * - Booking cards with poster, theater, date, seats, QR code
 * - Download and QR code buttons
 * - Empty state if no bookings exist
 *
 * Data: bookingHistory from mockData.js
 * Each booking references a movie object for poster/title.
 */

import { motion } from 'framer-motion'
import { Calendar, MapPin, Clock, Download, QrCode, Ticket, CheckCircle } from 'lucide-react'
import { bookingHistory } from '../data/mockData'
import Button from '../components/ui/Button'
import { Link } from 'react-router-dom'

const pageV = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0 },
}

export default function BookingHistoryPage() {
  return (
    <motion.div variants={pageV} initial="initial" animate="animate" exit="exit" className="pt-20 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-display font-bold mb-1">Booking History</h1>
          <p className="text-white/40 text-xs sm:text-sm">Your past and upcoming bookings</p>
        </motion.div>

        {/* ── Stats Cards ── */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3 mb-6 sm:mb-8">
          {[
            { label: 'Total Bookings', value: bookingHistory.length, icon: Ticket, color: 'text-primary' },
            { label: 'Completed', value: bookingHistory.filter(b => b.status === 'completed').length, icon: CheckCircle, color: 'text-success' },
            { label: 'Upcoming', value: bookingHistory.filter(b => b.status === 'confirmed').length, icon: Calendar, color: 'text-accent' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="p-3 sm:p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-center"
            >
              <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1.5 ${stat.color}`} />
              <p className="text-xl sm:text-2xl font-bold">{stat.value}</p>
              <p className="text-[9px] sm:text-[10px] text-white/30">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* ── Booking Cards ── */}
        <div className="space-y-3 sm:space-y-4">
          {bookingHistory.map((booking, i) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-300 group"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Movie Poster */}
                <Link to={`/movie/${booking.movie.id}`} className="flex-shrink-0">
                  <img
                    src={booking.movie.poster}
                    alt={booking.movie.title}
                    className="w-full sm:w-20 h-36 sm:h-28 rounded-xl object-cover group-hover:shadow-lg group-hover:shadow-primary/8 transition-all"
                  />
                </Link>

                {/* Booking Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0">
                      <h3 className="font-bold text-base sm:text-lg truncate">{booking.movie.title}</h3>
                      <p className="text-[10px] text-white/25">Booking ID: {booking.id}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold flex-shrink-0 ${
                      booking.status === 'confirmed'
                        ? 'bg-success/12 text-success'
                        : 'bg-white/5 text-white/40'
                    }`}>
                      {booking.status === 'confirmed' ? '✓ Confirmed' : '✓ Completed'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 text-xs sm:text-sm mb-3">
                    <p className="flex items-center gap-1.5 text-white/40"><MapPin className="w-3 h-3 flex-shrink-0" /><span className="truncate">{booking.theater}</span></p>
                    <p className="flex items-center gap-1.5 text-white/40"><Calendar className="w-3 h-3 flex-shrink-0" />{booking.date}</p>
                    <p className="flex items-center gap-1.5 text-white/40"><Clock className="w-3 h-3 flex-shrink-0" />{booking.time}</p>
                    <p className="flex items-center gap-1.5 text-white/40"><Ticket className="w-3 h-3 flex-shrink-0" />{booking.seats.join(', ')}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="font-bold text-base">₹{booking.total.toLocaleString()}</p>
                    <div className="flex gap-1.5">
                      <Button variant="ghost" size="xs" icon={QrCode}>QR</Button>
                      <Button variant="outline" size="xs" icon={Download}>Download</Button>
                    </div>
                  </div>
                </div>

                {/* QR Code (desktop only) */}
                <div className="hidden md:flex flex-col items-center justify-center flex-shrink-0 p-2.5 rounded-xl bg-white/3">
                  <img src={booking.qrCode} alt="QR Code" className="w-16 h-16 rounded-lg" />
                  <p className="text-[9px] text-white/20 mt-1">Scan at entry</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Empty State ── */}
        {bookingHistory.length === 0 && (
          <div className="text-center py-16 sm:py-20">
            <div className="w-16 h-16 rounded-full bg-white/3 flex items-center justify-center mx-auto mb-4">
              <Ticket className="w-8 h-8 text-white/20" />
            </div>
            <h3 className="text-base font-semibold mb-1.5">No bookings yet</h3>
            <p className="text-white/40 text-sm mb-6">Start your cinematic journey today!</p>
            <Link to="/"><Button variant="primary">Browse Movies</Button></Link>
          </div>
        )}
      </div>
    </motion.div>
  )
}
