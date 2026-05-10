/**
 * ProfilePage.jsx — User Account Dashboard
 *
 * A tabbed profile page with sidebar navigation.
 *
 * Layout:
 * - Profile header banner with avatar, stats, and edit button
 * - Left sidebar with tab buttons (sticky on desktop)
 * - Right content area that changes based on active tab
 *
 * Tabs:
 * 1. Personal Info — Name, email, phone, city cards + membership card
 * 2. Watchlist     — Movie cards grid from user's saved movies
 * 3. Saved Payments — List of cards and UPI with delete buttons
 * 4-6. Coming soon placeholders
 *
 * Data: All user data comes from mockData.userProfile
 */

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import {
  User, Mail, Phone, MapPin, CreditCard, Heart, Settings,
  Bell, Shield, LogOut, Edit2, Camera, Crown, Star, Trash2, Smartphone
} from 'lucide-react'
import { userProfile } from '../data/mockData'
import MovieCard from '../components/ui/MovieCard'
import Button from '../components/ui/Button'

const pageV = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0 },
}

const sidebarItems = [
  { label: 'Personal Info', icon: User, id: 'personal' },
  { label: 'Watchlist', icon: Heart, id: 'watchlist' },
  { label: 'Saved Payments', icon: CreditCard, id: 'payments' },
  { label: 'Notifications', icon: Bell, id: 'notifications' },
  { label: 'Security', icon: Shield, id: 'security' },
  { label: 'Settings', icon: Settings, id: 'settings' },
]

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('personal')
  const user = userProfile

  return (
    <motion.div variants={pageV} initial="initial" animate="animate" exit="exit" className="pt-20 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* ── Profile Header Banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl mb-6 sm:mb-8"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/15 to-primary/8" />
          <div className="absolute inset-0 bg-[#0a0a0a]/65" />
          <div className="relative p-5 sm:p-8 flex flex-col sm:flex-row items-center gap-5">
            {/* Avatar */}
            <div className="relative group flex-shrink-0">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 sm:w-28 sm:h-28 rounded-full object-cover ring-3 ring-primary/25"
              />
              <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="w-5 h-5" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-7 h-7 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                <Crown className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* User Info */}
            <div className="text-center sm:text-left flex-1 min-w-0">
              <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
                <h1 className="text-xl sm:text-2xl font-display font-bold truncate">{user.name}</h1>
                <span className="px-2 py-0.5 bg-gold/15 text-gold text-[10px] font-bold rounded-full flex-shrink-0">
                  {user.membershipTier}
                </span>
              </div>
              <p className="text-white/40 text-xs sm:text-sm mb-3">{user.email} • {user.city}</p>
              <div className="flex items-center gap-4 justify-center sm:justify-start">
                <div className="text-center">
                  <p className="font-bold text-base sm:text-lg">{user.totalBookings}</p>
                  <p className="text-[10px] text-white/30">Bookings</p>
                </div>
                <div className="w-px h-7 bg-white/8" />
                <div className="text-center">
                  <p className="font-bold text-base sm:text-lg">{user.watchlist.length}</p>
                  <p className="text-[10px] text-white/30">Watchlist</p>
                </div>
                <div className="w-px h-7 bg-white/8" />
                <div className="text-center">
                  <p className="font-bold text-base sm:text-lg flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-gold fill-gold" />4.8
                  </p>
                  <p className="text-[10px] text-white/30">Rating</p>
                </div>
              </div>
            </div>

            <Button variant="outline" size="sm" icon={Edit2} className="flex-shrink-0">Edit Profile</Button>
          </div>
        </motion.div>

        {/* ── Main Content Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="p-2.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-0.5 sticky top-24">
              {sidebarItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-primary/10 text-primary'
                      : 'text-white/45 hover:text-white hover:bg-white/4'
                  }`}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />{item.label}
                </button>
              ))}
              <div className="h-px bg-white/5 my-1.5" />
              <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-red-400 hover:bg-red-500/8 transition-all">
                <LogOut className="w-4 h-4" />Sign Out
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {activeTab === 'personal' && (
                <motion.div key="personal" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                    <h3 className="font-semibold text-sm mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { label: 'Full Name', value: user.name, icon: User },
                        { label: 'Email', value: user.email, icon: Mail },
                        { label: 'Phone', value: user.phone, icon: Phone },
                        { label: 'City', value: user.city, icon: MapPin },
                      ].map(field => (
                        <div key={field.label} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/4">
                          <div className="flex items-center gap-1.5 mb-1">
                            <field.icon className="w-3 h-3 text-white/25" />
                            <span className="text-[10px] text-white/30">{field.label}</span>
                          </div>
                          <p className="font-medium text-sm">{field.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                    <h3 className="font-semibold text-sm mb-3">Membership</h3>
                    <div className="p-4 rounded-xl bg-gradient-to-r from-gold/8 to-amber-900/8 border border-gold/15">
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center">
                            <Crown className="w-5 h-5 text-gold" />
                          </div>
                          <div>
                            <p className="font-bold text-gold text-sm">{user.membershipTier} Member</p>
                            <p className="text-[10px] text-white/35">Since {user.joinedDate}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Upgrade</Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'watchlist' && (
                <motion.div key="watchlist" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                    <h3 className="font-semibold text-sm mb-4">My Watchlist</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {user.watchlist.map((m, i) => (
                        <MovieCard key={m.id} movie={m} index={i} variant="compact" />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'payments' && (
                <motion.div key="payments" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-sm">Saved Payment Methods</h3>
                      <Button variant="outline" size="sm">+ Add New</Button>
                    </div>
                    <div className="space-y-2.5">
                      {user.savedPayments.map((pm, i) => (
                        <div key={i} className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/4 hover:border-white/8 transition-all">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
                              {pm.type === 'card' ? <CreditCard className="w-4 h-4 text-white/40" /> : <Smartphone className="w-4 h-4 text-white/40" />}
                            </div>
                            <div>
                              {pm.type === 'card' ? (
                                <>
                                  <p className="font-medium text-sm">{pm.brand} •••• {pm.last4}</p>
                                  <p className="text-[10px] text-white/30">Expires {pm.expiry}</p>
                                </>
                              ) : (
                                <>
                                  <p className="font-medium text-sm">UPI</p>
                                  <p className="text-[10px] text-white/30">{pm.id}</p>
                                </>
                              )}
                            </div>
                          </div>
                          <button className="p-2 hover:bg-red-500/8 rounded-lg text-white/25 hover:text-red-400 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {(activeTab === 'notifications' || activeTab === 'security' || activeTab === 'settings') && (
                <motion.div key="placeholder" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div className="p-12 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
                    <div className="w-14 h-14 rounded-full bg-white/3 flex items-center justify-center mx-auto mb-4">
                      <Settings className="w-7 h-7 text-white/20" />
                    </div>
                    <h3 className="font-semibold text-base mb-1.5">Coming Soon</h3>
                    <p className="text-white/35 text-sm">This section is under development.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
