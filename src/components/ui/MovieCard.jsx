/**
 * MovieCard.jsx — Reusable Movie Card Component
 *
 * This is the most-used visual component in the app.
 * It appears in: HomePage, SearchResultsPage, ProfilePage (watchlist).
 *
 * Two variants:
 * - "default"  → Larger card with full info (title, duration, language, genres, rating)
 * - "compact"  → Smaller card for grid layouts (poster + title + genre)
 *
 * Props:
 * @param {Object}  movie    — Movie data object from mockData.js
 * @param {number}  index    — Position in list (used for staggered animation delay)
 * @param {string}  variant  — "default" | "compact"
 *
 * Design decisions:
 * - Uses aspect-[2/3] to maintain consistent poster ratio
 * - Glow effect on hover via CSS class "glow-card"
 * - Rating badge uses glassmorphism for depth
 * - Format badges (IMAX, 4DX) use gradient for premium feel
 * - whileInView animation so cards animate as user scrolls
 */

import { motion } from 'framer-motion'
import { Star, Clock, Globe } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function MovieCard({ movie, index = 0, variant = 'default' }) {
  const cardVariants = {
    hidden: { opacity: 0, y: 24, scale: 0.97 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: Math.min(index * 0.08, 0.4), // cap delay to avoid slow loads
        ease: [0.4, 0, 0.2, 1],
      },
    },
  }

  /* ─── COMPACT VARIANT ─── */
  if (variant === 'compact') {
    return (
      <motion.div variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}>
        <Link to={`/movie/${movie.id}`} className="group block">
          <div className="relative overflow-hidden rounded-xl aspect-[2/3] glow-card">
            <img
              src={movie.poster}
              alt={movie.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 ease-cinematic group-hover:scale-105"
            />
            {/* Permanent bottom gradient for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

            {/* Rating badge — top left */}
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-lg">
              <Star className="w-3 h-3 text-gold fill-gold" />
              <span className="font-bold text-xs">{movie.rating}</span>
            </div>

            {/* IMAX badge — top right */}
            {movie.format?.some(f => f.includes('IMAX')) && (
              <div className="absolute top-2.5 right-2.5 bg-gradient-to-r from-primary to-accent px-2 py-0.5 rounded text-[9px] font-bold tracking-widest uppercase">
                IMAX
              </div>
            )}
          </div>

          {/* Card title + genre (below poster) */}
          <div className="mt-2.5 px-0.5">
            <h3 className="font-semibold text-[13px] leading-tight truncate group-hover:text-primary transition-colors duration-300">
              {movie.title}
            </h3>
            <p className="text-[11px] text-text-muted mt-0.5 truncate">
              {movie.genre.slice(0, 2).join(' / ')}
            </p>
          </div>
        </Link>
      </motion.div>
    )
  }

  /* ─── DEFAULT VARIANT ─── */
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
    >
      <Link to={`/movie/${movie.id}`} className="group block">
        <div className="relative overflow-hidden rounded-2xl aspect-[2/3] glow-card">
          <img
            src={movie.poster}
            alt={movie.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-cinematic group-hover:scale-105"
          />

          {/* Multi-layer gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90" />

          {/* Hover glow border */}
          <div className="absolute inset-0 rounded-2xl ring-1 ring-white/5 group-hover:ring-primary/30 transition-all duration-500" />

          {/* Rating badge — glassmorphism */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-xl px-2.5 py-1 rounded-lg border border-white/5">
            <Star className="w-3.5 h-3.5 text-gold fill-gold" />
            <span className="font-bold text-sm leading-none">{movie.rating}</span>
            <span className="text-white/40 text-[10px] leading-none">/ 10</span>
          </div>

          {/* Format badges — top right */}
          {movie.format && (
            <div className="absolute top-3 right-3 flex flex-col gap-1">
              {movie.format.slice(0, 2).map((f) => (
                <span
                  key={f}
                  className="bg-gradient-to-r from-primary/90 to-accent/90 backdrop-blur-sm px-2 py-0.5 rounded text-[9px] font-bold tracking-wider text-center uppercase"
                >
                  {f}
                </span>
              ))}
            </div>
          )}

          {/* Bottom info panel */}
          <div className="absolute bottom-0 left-0 right-0 p-3.5 sm:p-4">
            <h3 className="font-bold text-base sm:text-lg leading-tight mb-1.5 line-clamp-2 group-hover:text-primary transition-colors duration-300">
              {movie.title}
            </h3>
            <div className="flex items-center gap-2.5 text-[11px] text-white/60 mb-2">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {movie.duration}
              </span>
              <span className="w-0.5 h-0.5 rounded-full bg-white/30" />
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3" />
                {movie.language}
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {movie.genre.slice(0, 3).map((g) => (
                <span key={g} className="px-2 py-0.5 rounded-md bg-white/8 text-[10px] font-medium text-white/70">
                  {g}
                </span>
              ))}
            </div>

            {/* "Book Tickets" — visible on hover (CSS only, no motion needed) */}
            <div className="mt-2.5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400">
              <div className="bg-gradient-to-r from-primary to-primary-dark text-center py-2 rounded-lg text-xs font-semibold tracking-wide">
                Book Tickets →
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
