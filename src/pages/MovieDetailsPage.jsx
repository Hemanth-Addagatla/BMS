/**
 * MovieDetailsPage.jsx — Individual Movie View
 *
 * Shows everything about a specific movie:
 * - Hero backdrop with poster overlay
 * - Rating, meta info, genres, action buttons
 * - About (synopsis) section
 * - Horizontal scrolling Cast section
 * - Screenshots gallery grid
 * - User Reviews with avatars & likes
 * - Date picker + Theater showtimes
 *
 * Data flow:
 * - Movie ID comes from URL params via useParams()
 * - Movie data found by filtering mockData.movies
 * - Dates are dynamically generated (next 7 days)
 * - Theaters come from mockData.theaters
 *
 * Navigation: Showtime buttons link to /seats/:id
 */

import { motion } from 'framer-motion'
import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import {
  Star, Clock, Globe, Play, Calendar, Award, Heart,
  Share2, MapPin, Ticket, ThumbsUp
} from 'lucide-react'
import { movies, theaters } from '../data/mockData'
import Button from '../components/ui/Button'

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
}

export default function MovieDetailsPage() {
  const { id } = useParams()
  const movie = movies.find(m => m.id === Number(id)) || movies[0]
  const [selectedDate, setSelectedDate] = useState(0)
  const [liked, setLiked] = useState(false)

  // Generate next 7 days for date picker
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    return {
      day: d.toLocaleDateString('en', { weekday: 'short' }),
      date: d.getDate(),
      month: d.toLocaleDateString('en', { month: 'short' }),
      full: d.toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' }),
    }
  })

  // Colors for showtime filling status
  const fillingColors = {
    available: 'border-success text-success hover:bg-success/5',
    'fast-filling': 'border-warning text-warning hover:bg-warning/5',
    'almost-full': 'border-primary text-primary hover:bg-primary/5',
  }

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">

      {/* ═══════ HERO BACKDROP ═══════ */}
      <section className="relative h-[55vh] sm:h-[60vh] md:h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <img src={movie.backdrop} alt={movie.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-end pb-8 sm:pb-10">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-end w-full">
            {/* Poster */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="hidden md:block flex-shrink-0"
            >
              <div className="relative group">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-48 lg:w-56 aspect-[2/3] object-cover rounded-2xl shadow-2xl shadow-black/60"
                />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10" />
                <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-primary/15 to-accent/15 -z-10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                {/* Play trailer overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 rounded-2xl cursor-pointer">
                  <div className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20 hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Movie Info */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex-1 min-w-0"
            >
              {/* Format badges */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {movie.format?.map((f) => (
                  <span key={f} className="px-2.5 py-0.5 bg-gradient-to-r from-primary/80 to-accent/80 text-[10px] font-bold rounded-full tracking-wider uppercase">
                    {f}
                  </span>
                ))}
                <span className="px-2.5 py-0.5 bg-white/8 backdrop-blur-sm text-[10px] font-medium rounded-full border border-white/10">
                  {movie.certification}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-black leading-[1.1] mb-3">
                {movie.title}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-1.5 bg-success/15 px-3 py-1.5 rounded-xl border border-success/20">
                  <Star className="w-4 h-4 fill-success text-success" />
                  <span className="font-bold text-base">{movie.rating}</span>
                  <span className="text-white/40 text-xs">/10</span>
                </div>
                <span className="text-xs text-white/40">{movie.votes} votes</span>
              </div>

              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-white/45 mb-3">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> {movie.duration}
                </span>
                <span className="w-0.5 h-0.5 rounded-full bg-white/20" />
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" /> {movie.languages?.join(', ')}
                </span>
                <span className="w-0.5 h-0.5 rounded-full bg-white/20" />
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> {movie.releaseDate}
                </span>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {movie.genre.map((g) => (
                  <span key={g} className="px-3 py-1 rounded-full bg-white/5 border border-white/8 text-xs font-medium text-white/60">
                    {g}
                  </span>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-2.5">
                <Link to={`/seats/${movie.id}`}>
                  <Button variant="primary" size="lg" icon={Ticket}>
                    Book Tickets
                  </Button>
                </Link>
                <Button variant="glass" size="lg" icon={Play}>
                  Trailer
                </Button>
                <button
                  onClick={() => setLiked(!liked)}
                  className={`p-2.5 rounded-xl border transition-all duration-300 ${
                    liked
                      ? 'bg-primary/15 border-primary/25 text-primary'
                      : 'border-white/8 hover:bg-white/5 text-white/50'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${liked ? 'fill-primary' : ''}`} />
                </button>
                <button className="p-2.5 rounded-xl border border-white/8 hover:bg-white/5 text-white/50 transition-all">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════ CONTENT SECTIONS ═══════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* ── Storyline ── */}
        <section className="py-8 sm:py-10 border-b border-white/5">
          <h2 className="text-lg sm:text-xl font-display font-bold mb-3">About the Movie</h2>
          <p className="text-white/55 leading-relaxed text-sm sm:text-base max-w-3xl">{movie.synopsis}</p>
          <div className="flex items-center gap-2 mt-4 text-sm">
            <Award className="w-4 h-4 text-primary" />
            <span className="text-white/45">Directed by</span>
            <span className="font-semibold">{movie.director}</span>
          </div>
        </section>

        {/* ── Cast ── */}
        <section className="py-8 sm:py-10 border-b border-white/5">
          <h2 className="text-lg sm:text-xl font-display font-bold mb-5">Cast</h2>
          <div className="flex gap-5 sm:gap-6 overflow-x-auto no-scrollbar pb-2">
            {movie.cast.map((person, i) => (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex-shrink-0 text-center group"
              >
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-2.5 ring-2 ring-white/6 group-hover:ring-primary/40 transition-all duration-400">
                  <img src={person.photo} alt={person.name} loading="lazy" className="w-full h-full object-cover" />
                </div>
                <p className="text-xs sm:text-sm font-medium leading-tight">{person.name}</p>
                <p className="text-[10px] sm:text-xs text-white/40 mt-0.5">{person.role}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Screenshots ── */}
        <section className="py-8 sm:py-10 border-b border-white/5">
          <h2 className="text-lg sm:text-xl font-display font-bold mb-5">Screenshots</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
            {movie.screenshots.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="overflow-hidden rounded-xl group cursor-pointer"
              >
                <img
                  src={img}
                  alt={`Screenshot ${i + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover aspect-video transition-transform duration-500 group-hover:scale-105"
                />
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Reviews ── */}
        <section className="py-8 sm:py-10 border-b border-white/5">
          <h2 className="text-lg sm:text-xl font-display font-bold mb-5">Top Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {[
              { user: 'MovieBuff_99', rating: 9, text: 'Absolutely spectacular! The visuals are breathtaking and the story keeps you at the edge of your seat. A must-watch in IMAX!', likes: 234 },
              { user: 'CinemaLover', rating: 8, text: 'Great performances by the entire cast. The direction is top-notch. A few pacing issues in the second half but overall a fantastic experience.', likes: 189 },
              { user: 'FilmCritic_Pro', rating: 8.5, text: 'A visual masterpiece that pushes the boundaries of cinema. The sound design and cinematography are world-class.', likes: 156 },
              { user: 'PopcornKing', rating: 9.5, text: 'Best movie of the year, hands down! Every frame is a painting. The emotional depth is incredible.', likes: 312 },
            ].map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold">
                      {review.user[0]}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{review.user}</p>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-gold text-gold" />
                        <span className="text-xs font-medium">{review.rating}/10</span>
                      </div>
                    </div>
                  </div>
                  <button className="flex items-center gap-1 text-xs text-white/35 hover:text-primary transition-colors">
                    <ThumbsUp className="w-3 h-3" />
                    {review.likes}
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-white/50 leading-relaxed">{review.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Showtimes ── */}
        <section className="py-8 sm:py-10">
          <h2 className="text-lg sm:text-xl font-display font-bold mb-5">Show Timings</h2>

          {/* Date Selector */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 mb-5">
            {dates.map((d, i) => (
              <button
                key={i}
                onClick={() => setSelectedDate(i)}
                className={`flex-shrink-0 flex flex-col items-center px-3.5 py-2.5 rounded-xl border transition-all duration-300 min-w-[64px] ${
                  selectedDate === i
                    ? 'bg-primary/15 border-primary/25 text-primary'
                    : 'border-white/6 hover:border-white/12 hover:bg-white/3'
                }`}
              >
                <span className="text-[10px] font-medium uppercase tracking-wider">{d.day}</span>
                <span className="text-lg font-bold leading-tight">{d.date}</span>
                <span className="text-[10px] text-inherit opacity-60">{d.month}</span>
              </button>
            ))}
          </div>

          {/* Theater Cards */}
          <div className="space-y-3 sm:space-y-4">
            {theaters.map((theater, i) => (
              <motion.div
                key={theater.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm sm:text-base">{theater.name}</h3>
                      {theater.features.includes('IMAX') && (
                        <span className="px-2 py-0.5 bg-primary/15 text-primary text-[9px] font-bold rounded-full">IMAX</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-white/40">
                      <MapPin className="w-3 h-3" />
                      <span>{theater.location}</span>
                      <span className="text-white/25">• {theater.distance}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {theater.features.map((f) => (
                      <span key={f} className="px-2 py-0.5 bg-white/4 border border-white/6 rounded-lg text-[10px] text-white/50">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Show times */}
                <div className="flex flex-wrap gap-2">
                  {theater.shows.map((show, j) => (
                    <Link
                      key={j}
                      to={`/seats/${movie.id}`}
                      className={`px-3.5 py-2 rounded-xl border-2 text-sm font-medium transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] ${fillingColors[show.filling]}`}
                    >
                      <div className="text-center">
                        <span className="font-semibold text-xs sm:text-sm">{show.time}</span>
                        <div className="text-[9px] mt-0.5 opacity-60">{show.format} • ₹{show.price}</div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Filling legend */}
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/4 text-[10px] text-white/30">
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-success" /> Available</span>
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-warning" /> Fast Filling</span>
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> Almost Full</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  )
}
