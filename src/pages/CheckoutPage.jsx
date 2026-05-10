/**
 * CheckoutPage.jsx — Payment & Order Confirmation
 *
 * The final step in the booking flow. Shows:
 * 1. Ticket summary card (movie poster, theater, date, seats)
 * 2. Promo code input (CINE50 gives 10% off)
 * 3. Payment method selector (UPI, Card, Net Banking, Wallets)
 * 4. Order summary with price breakdown
 * 5. Animated success confirmation modal
 *
 * Data flow:
 * - Booking data arrives via React Router's location.state
 *   (passed from SeatSelectionPage's navigate() call)
 * - If no state exists, shows "No booking data" fallback
 *
 * State:
 * - selectedPayment: which payment method radio is active
 * - promoCode/promoApplied: promo code input + applied status
 * - processing: shows loading spinner on pay button
 * - confirmed: triggers success modal animation
 */

import { motion, AnimatePresence } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { CreditCard, Smartphone, CheckCircle, Ticket, MapPin, Clock, Calendar, Shield, Tag } from 'lucide-react'
import Button from '../components/ui/Button'
import toast from 'react-hot-toast'

const pageV = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0 },
}

const paymentMethods = [
  { id: 'upi', label: 'UPI', desc: 'Google Pay, PhonePe, Paytm', icon: Smartphone, badges: ['GPay', 'PhonePe', 'Paytm'] },
  { id: 'card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay', icon: CreditCard, badges: ['Visa', 'MC'] },
  { id: 'netbanking', label: 'Net Banking', desc: 'All major banks supported', icon: CreditCard, badges: [] },
  { id: 'wallet', label: 'Wallets', desc: 'Amazon Pay, Mobikwik', icon: Smartphone, badges: ['Amazon'] },
]

export default function CheckoutPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { movie, seats = [], total = 0, theater, showtime, date } = location.state || {}

  const [selectedPayment, setSelectedPayment] = useState('upi')
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  // Price calculations
  const discount = promoApplied ? Math.round(total * 0.1) : 0
  const convFee = 49
  const finalTotal = total - discount + convFee

  const applyPromo = () => {
    if (promoCode.toLowerCase() === 'cine50') {
      setPromoApplied(true)
      toast.success('Promo code applied! 🎉')
    } else {
      toast.error('Invalid promo code')
    }
  }

  const handlePay = () => {
    setProcessing(true)
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false)
      setConfirmed(true)
    }, 2000)
  }

  // Fallback if user navigates directly to /checkout without booking data
  if (!movie) {
    return (
      <div className="pt-24 pb-20 text-center">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
          <Ticket className="w-8 h-8 text-white/30" />
        </div>
        <p className="text-white/50 mb-4">No booking data found.</p>
        <Button variant="primary" onClick={() => navigate('/')}>Go Home</Button>
      </div>
    )
  }

  return (
    <motion.div variants={pageV} initial="initial" animate="animate" exit="exit" className="pt-20 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h1 className="text-xl sm:text-2xl font-display font-bold mb-6">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* ── Left Column: Booking Info + Payment ── */}
          <div className="lg:col-span-3 space-y-4">
            {/* Ticket Summary Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="flex gap-4">
                <img src={movie.poster} alt={movie.title} className="w-16 sm:w-20 aspect-[2/3] rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-base sm:text-lg mb-1 truncate">{movie.title}</h2>
                  <p className="text-xs text-white/40 flex items-center gap-1 mb-1"><MapPin className="w-3 h-3 flex-shrink-0" />{theater}</p>
                  <p className="text-xs text-white/40 flex items-center gap-1 mb-2">
                    <Calendar className="w-3 h-3 flex-shrink-0" />{date}
                    <Clock className="w-3 h-3 ml-2 flex-shrink-0" />{showtime}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {seats.map(s => (
                      <span key={s.id} className="px-2 py-0.5 bg-primary/15 text-primary text-[10px] font-semibold rounded-lg">{s.id}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Promo Code */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/5">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4 text-primary" />Promo Code
              </h3>
              <div className="flex gap-2">
                <input
                  value={promoCode}
                  onChange={e => setPromoCode(e.target.value)}
                  placeholder="Enter code (try CINE50)"
                  className="flex-1 px-4 py-2.5 bg-white/3 border border-white/6 rounded-xl text-sm outline-none focus:border-primary/40 placeholder:text-white/20 transition-colors"
                  disabled={promoApplied}
                />
                <Button variant={promoApplied ? 'success' : 'outline'} onClick={applyPromo} disabled={promoApplied || !promoCode}>
                  {promoApplied ? '✓ Applied' : 'Apply'}
                </Button>
              </div>
              {promoApplied && (
                <p className="text-[11px] text-success mt-2">10% discount applied — you saved ₹{discount}!</p>
              )}
            </div>

            {/* Payment Methods */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/5">
              <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-primary" />Payment Method
              </h3>
              <div className="space-y-2">
                {paymentMethods.map(pm => (
                  <button
                    key={pm.id}
                    onClick={() => setSelectedPayment(pm.id)}
                    className={`w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border transition-all duration-300 text-left ${
                      selectedPayment === pm.id
                        ? 'border-primary/30 bg-primary/5'
                        : 'border-white/5 hover:border-white/10 hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      selectedPayment === pm.id ? 'bg-primary/15 text-primary' : 'bg-white/5 text-white/30'
                    }`}>
                      <pm.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-xs sm:text-sm">{pm.label}</p>
                      <p className="text-[10px] sm:text-xs text-white/30">{pm.desc}</p>
                    </div>
                    <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      selectedPayment === pm.id ? 'border-primary' : 'border-white/15'
                    }`}>
                      {selectedPayment === pm.id && <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-primary" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right Column: Order Summary ── */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/5">
              <h3 className="font-semibold text-sm mb-4">Order Summary</h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/45">Tickets ({seats.length}x)</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between text-success">
                    <span>Discount (10%)</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-white/45">Convenience Fee</span>
                  <span>₹{convFee}</span>
                </div>
                <div className="h-px bg-white/5 my-1" />
                <div className="flex justify-between text-base sm:text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">₹{finalTotal.toLocaleString()}</span>
                </div>
              </div>
              <Button
                variant="primary"
                size="lg"
                className="w-full mt-5"
                onClick={handlePay}
                loading={processing}
              >
                {processing ? 'Processing...' : `Pay ₹${finalTotal.toLocaleString()}`}
              </Button>
              <p className="flex items-center justify-center gap-1 text-[10px] text-white/20 mt-3">
                <Shield className="w-3 h-3" />Secured by 256-bit SSL encryption
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════ Success Confirmation Modal ═══════ */}
      <AnimatePresence>
        {confirmed && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[80]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 22, stiffness: 280 }}
              className="fixed inset-0 flex items-center justify-center z-[90] p-4"
            >
              <div className="w-full max-w-sm glass rounded-3xl p-7 sm:p-8 text-center shadow-2xl">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.15 }}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-success/15 flex items-center justify-center mx-auto mb-5"
                >
                  <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-success" />
                </motion.div>
                <h2 className="text-xl sm:text-2xl font-display font-bold mb-2">Booking Confirmed! 🎬</h2>
                <p className="text-white/50 text-sm mb-1">{movie.title}</p>
                <p className="text-white/30 text-xs mb-4">{theater} • {date}, {showtime}</p>
                <div className="flex flex-wrap justify-center gap-1.5 mb-4">
                  {seats.map(s => (
                    <span key={s.id} className="px-2.5 py-1 bg-primary/15 text-primary text-xs font-bold rounded-lg">{s.id}</span>
                  ))}
                </div>
                <p className="text-lg font-bold mb-6">
                  Total: <span className="text-primary">₹{finalTotal.toLocaleString()}</span>
                </p>
                <div className="space-y-2">
                  <Button variant="primary" size="lg" className="w-full" onClick={() => navigate('/bookings')}>View Booking</Button>
                  <Button variant="ghost" size="md" className="w-full" onClick={() => navigate('/')}>Back to Home</Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
