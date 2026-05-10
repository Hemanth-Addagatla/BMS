/**
 * HomePage.jsx — Landing Page
 *
 * The first page users see. Designed to feel like Netflix/BookMyShow.
 *
 * Sections (in order):
 * 1. Hero Carousel      — Full-screen featured movies with fade effect
 * 2. Quick Categories   — 4 action cards (Movies, Events, Sports, Stream)
 * 3. Recommended        — Compact movie cards in 6-column grid
 * 4. Trending Now       — Horizontal Swiper carousel
 * 5. IMAX Experiences   — Wide landscape cards with cinematic bg
 * 6. Upcoming Movies    — Standard movie card grid
 * 7. Popular Events     — Event cards with category badges
 * 8. Promo Banner       — Full-width gradient CTA
 *
 * Data flow:
 * - All data comes from mockData.js (static imports)
 * - Movies are filtered by category/flags for each section
 * - Loading state simulates API delay for skeleton effect
 */

import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/pagination'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Play, Star, Clock, Ticket, TrendingUp, Sparkles, Calendar, PartyPopper, Monitor } from 'lucide-react'

import { movies, events } from '../data/mockData'
import MovieCard from '../components/ui/MovieCard'
import SectionHeader from '../components/ui/SectionHeader'
import Button from '../components/ui/Button'
import SkeletonCard from '../components/ui/Skeleton'

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
}

export default function HomePage() {
  // Simulate API loading delay
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  // Filter movies into sections based on their properties
  const featured = movies.filter(m => m.isFeatured)
  const trending = movies.filter(m => m.category === 'trending' || m.isNowShowing)
  const imax = movies.filter(m => m.format?.some(f => f.includes('IMAX')))
  const upcoming = movies.filter(m => m.category === 'upcoming' || !m.isNowShowing)
  const recommended = movies.slice(0, 6)

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">

      {/* ═══════════════════════════════════════════════
          SECTION 1: HERO CAROUSEL
          Full-screen with Swiper fade effect + autoplay.
          Each slide has: backdrop image, gradient overlays,
          movie info, CTA buttons, and a floating poster.
         ═══════════════════════════════════════════════ */}
      <section className="relative h-[75vh] sm:h-[80vh] md:h-[85vh] overflow-hidden">
        <Swiper
          modules={[Autoplay, EffectFade, Pagination]}
          effect="fade"
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop
          className="h-full"
        >
          {featured.map((movie) => (
            <SwiperSlide key={movie.id}>
              <div className="relative h-full">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img
                    src={movie.backdrop}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Left-to-right fade for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-transparent" />
                  {/* Bottom fade to merge with content below */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-black/20" />
                </div>

                {/* Hero Content */}
                <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center">
                  <div className="max-w-xl lg:max-w-2xl">
                    <motion.div
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, delay: 0.2 }}
                    >
                      {/* Format & Certification Tags */}
                      <div className="flex items-center gap-2 mb-4">
                        {movie.format?.slice(0, 2).map((f) => (
                          <span key={f} className="px-3 py-1 bg-gradient-to-r from-primary to-accent text-[10px] font-bold rounded-full tracking-wider uppercase">
                            {f}
                          </span>
                        ))}
                        <span className="px-3 py-1 bg-white/8 backdrop-blur-sm text-[10px] font-medium rounded-full border border-white/10">
                          {movie.certification}
                        </span>
                      </div>

                      {/* Movie Title */}
                      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-black leading-[1.1] mb-3">
                        {movie.title}
                      </h1>

                      {/* Tagline */}
                      <p className="text-base sm:text-lg text-white/60 italic mb-4 leading-relaxed">
                        "{movie.tagline}"
                      </p>

                      {/* Rating + Duration + Genre */}
                      <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-5 text-sm text-white/50">
                        <span className="flex items-center gap-1.5 text-gold font-semibold text-base">
                          <Star className="w-4 h-4 fill-gold text-gold" />
                          {movie.rating}/10
                          <span className="text-white/30 text-xs font-normal ml-0.5">({movie.votes})</span>
                        </span>
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {movie.duration}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        <span className="hidden sm:inline">{movie.genre.join(' • ')}</span>
                      </div>

                      {/* Language Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {movie.languages?.map((lang) => (
                          <span key={lang} className="px-2.5 py-1 rounded-full bg-white/5 border border-white/8 text-[11px] font-medium text-white/60">
                            {lang}
                          </span>
                        ))}
                      </div>

                      {/* CTA Buttons */}
                      <div className="flex items-center gap-3">
                        <Link to={`/movie/${movie.id}`}>
                          <Button variant="primary" size="lg" icon={Ticket}>
                            Book Tickets
                          </Button>
                        </Link>
                        <Button variant="glass" size="lg" icon={Play}>
                          Watch Trailer
                        </Button>
                      </div>
                    </motion.div>
                  </div>

                  {/* Floating Poster — visible only on large screens */}
                  <motion.div
                    initial={{ opacity: 0, x: 40, rotate: 2 }}
                    animate={{ opacity: 1, x: 0, rotate: 0 }}
                    transition={{ duration: 0.9, delay: 0.5 }}
                    className="hidden lg:block absolute right-8 xl:right-16 bottom-20"
                  >
                    <div className="relative">
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="w-52 xl:w-60 aspect-[2/3] object-cover rounded-2xl shadow-2xl shadow-black/60"
                      />
                      <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10" />
                      {/* Soft glow behind poster */}
                      <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-primary/15 to-accent/15 -z-10 blur-2xl" />
                    </div>
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 2: QUICK CATEGORIES
          4 clickable cards overlapping the hero section.
         ═══════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-6 sm:-mt-8 relative z-10 mb-12 sm:mb-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {[
            { label: 'Movies', icon: '🎬', color: 'from-red-500/15 to-red-900/15', border: 'border-red-500/15', hoverBorder: 'hover:border-red-500/30' },
            { label: 'Events', icon: '🎤', color: 'from-purple-500/15 to-purple-900/15', border: 'border-purple-500/15', hoverBorder: 'hover:border-purple-500/30' },
            { label: 'Sports', icon: '⚽', color: 'from-green-500/15 to-green-900/15', border: 'border-green-500/15', hoverBorder: 'hover:border-green-500/30' },
            { label: 'Stream', icon: '📺', color: 'from-blue-500/15 to-blue-900/15', border: 'border-blue-500/15', hoverBorder: 'hover:border-blue-500/30' },
          ].map((cat, i) => (
            <motion.button
              key={cat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i, duration: 0.4 }}
              className={`flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br ${cat.color} border ${cat.border} ${cat.hoverBorder} backdrop-blur-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-300`}
            >
              <span className="text-2xl sm:text-3xl">{cat.icon}</span>
              <span className="font-display font-semibold text-sm sm:text-base">{cat.label}</span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 3: RECOMMENDED MOVIES (Compact Cards)
         ═══════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-14 sm:mb-16">
        <SectionHeader
          title="Recommended For You"
          subtitle="Handpicked based on your preferences"
          icon={Sparkles}
          label="For You"
          action="See All"
        />
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
          {loading
            ? <SkeletonCard count={6} />
            : recommended.map((movie, i) => (
                <MovieCard key={movie.id} movie={movie} index={i} variant="compact" />
              ))
          }
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 4: TRENDING NOW (Swiper Carousel)
         ═══════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-14 sm:mb-16">
        <SectionHeader
          title="Trending Now"
          subtitle="Most booked movies this week"
          icon={TrendingUp}
          label="Trending"
          action="See All"
        />
        <Swiper
          modules={[Autoplay]}
          spaceBetween={14}
          slidesPerView={2.2}
          breakpoints={{
            480: { slidesPerView: 2.5, spaceBetween: 14 },
            640: { slidesPerView: 3, spaceBetween: 16 },
            768: { slidesPerView: 3.5, spaceBetween: 16 },
            1024: { slidesPerView: 4.5, spaceBetween: 18 },
            1280: { slidesPerView: 5, spaceBetween: 20 },
          }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          className="!overflow-visible"
        >
          {trending.map((movie, i) => (
            <SwiperSlide key={movie.id}>
              <MovieCard movie={movie} index={i} />
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 5: IMAX EXPERIENCES (Wide Landscape Cards)
          Has a subtle background gradient for visual separation.
         ═══════════════════════════════════════════════ */}
      <section className="mb-14 sm:mb-16">
        <div className="relative py-12 sm:py-16 overflow-hidden">
          {/* Cinematic gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.03] via-accent/[0.04] to-primary/[0.03]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/[0.06] via-transparent to-transparent" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
            <SectionHeader
              title="Top IMAX Experiences"
              subtitle="See it bigger. Feel it stronger."
              icon={Monitor}
              label="IMAX"
              action="Explore IMAX"
            />
            <Swiper
              spaceBetween={16}
              slidesPerView={1.1}
              breakpoints={{
                640: { slidesPerView: 1.8, spaceBetween: 16 },
                1024: { slidesPerView: 2.5, spaceBetween: 20 },
                1280: { slidesPerView: 3, spaceBetween: 20 },
              }}
              className="!overflow-visible"
            >
              {imax.map((movie) => (
                <SwiperSlide key={movie.id}>
                  <Link to={`/movie/${movie.id}`} className="group block">
                    <div className="relative overflow-hidden rounded-2xl aspect-video glow-card">
                      <img
                        src={movie.backdrop}
                        alt={movie.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 ease-cinematic group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute inset-0 rounded-2xl ring-1 ring-white/5 group-hover:ring-primary/20 transition-all duration-500" />
                      <div className="absolute top-3.5 left-3.5">
                        <span className="px-3 py-1 bg-gradient-to-r from-primary to-accent text-[10px] font-bold rounded-full tracking-widest uppercase">
                          IMAX
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                        <h3 className="text-lg sm:text-xl font-display font-bold mb-1 group-hover:text-primary transition-colors">{movie.title}</h3>
                        <p className="text-xs sm:text-sm text-white/50">{movie.genre.join(' • ')} • {movie.duration}</p>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 6: UPCOMING MOVIES (Grid)
         ═══════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-14 sm:mb-16">
        <SectionHeader
          title="Upcoming Movies"
          subtitle="Mark your calendars"
          icon={Calendar}
          label="Coming Soon"
          action="View All"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {upcoming.map((movie, i) => (
            <MovieCard key={movie.id} movie={movie} index={i} />
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 7: POPULAR EVENTS (Grid)
         ═══════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-14 sm:mb-16">
        <SectionHeader
          title="Popular Events"
          subtitle="Live experiences near you"
          icon={PartyPopper}
          label="Events"
          action="Explore Events"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {events.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i * 0.08, 0.3), duration: 0.4 }}
              className="group"
            >
              <div className="relative overflow-hidden rounded-2xl glow-card">
                <img
                  src={event.image}
                  alt={event.title}
                  loading="lazy"
                  className="w-full h-44 object-cover transition-transform duration-600 ease-cinematic group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 bg-accent/80 backdrop-blur-sm rounded-full text-[9px] font-bold tracking-wider uppercase">
                    {event.category}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-semibold text-sm mb-1 leading-snug group-hover:text-primary transition-colors">{event.title}</h3>
                  <p className="text-[11px] text-white/50 mb-0.5">{event.date}</p>
                  <p className="text-[11px] text-white/40">{event.venue}</p>
                  <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-white/5">
                    <span className="text-sm font-bold text-primary">{event.price}</span>
                    <span className="text-[10px] text-white/35">onwards</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 8: PROMO BANNER
         ═══════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-16 sm:mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ij48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnYtNGg0djJoLTR2NnptLTYtNmgydi00aC0yVjIwaC00djJoNHY2em0xMi04aDR2MmgtNHYtMnptLTggMGg0djJoLTR2LTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20" />
          <div className="relative px-6 sm:px-10 py-10 sm:py-14 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-black mb-2.5">
              🎬 First Booking? Get 50% OFF!
            </h2>
            <p className="text-sm sm:text-base text-white/75 mb-6 max-w-lg mx-auto leading-relaxed">
              Use code <span className="font-bold text-white bg-white/15 px-2 py-0.5 rounded-md">CINE50</span> on your first booking and save big.
            </p>
            <Button variant="glass" size="lg" className="bg-white/15 hover:bg-white/25 border-white/20">
              Claim Offer Now
            </Button>
          </div>
        </motion.div>
      </section>
    </motion.div>
  )
}
