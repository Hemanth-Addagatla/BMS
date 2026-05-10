/**
 * SearchResultsPage.jsx — Movie Search with Filters
 *
 * Features:
 * - Text search input with clear button
 * - Expandable filter panel (Genre + Language pills)
 * - Results count with search query highlighted
 * - Movie card grid showing filtered results
 * - Empty state when no matches found
 *
 * Filtering logic (all combined with AND):
 * 1. searchInput: matches against movie title or genre names
 * 2. selectedGenre: exact match against movie.genre array
 * 3. selectedLang: matches movie.language or movie.languages array
 *
 * URL: The search query comes from ?q= URL param (set by navbar search)
 */

import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useState, useMemo } from 'react'
import { movies } from '../data/mockData'
import MovieCard from '../components/ui/MovieCard'
import Button from '../components/ui/Button'

const pageV = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0 },
}

const genres = ['All', 'Action', 'Drama', 'Sci-Fi', 'Thriller', 'Comedy', 'Adventure', 'Biography', 'Fantasy']
const languages = ['All', 'English', 'Hindi', 'Telugu', 'Tamil', 'Malayalam']

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [searchInput, setSearchInput] = useState(query)
  const [selectedGenre, setSelectedGenre] = useState('All')
  const [selectedLang, setSelectedLang] = useState('All')
  const [showFilters, setShowFilters] = useState(false)

  // Memoized filtered results — recalculates only when filters change
  const results = useMemo(() => {
    return movies.filter(m => {
      const matchesSearch = !searchInput ||
        m.title.toLowerCase().includes(searchInput.toLowerCase()) ||
        m.genre.some(g => g.toLowerCase().includes(searchInput.toLowerCase()))
      const matchesGenre = selectedGenre === 'All' || m.genre.includes(selectedGenre)
      const matchesLang = selectedLang === 'All' || m.language === selectedLang || m.languages?.includes(selectedLang)
      return matchesSearch && matchesGenre && matchesLang
    })
  }, [searchInput, selectedGenre, selectedLang])

  return (
    <motion.div variants={pageV} initial="initial" animate="animate" exit="exit" className="pt-20 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* ── Search Bar ── */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-6 sm:mb-8">
          <div className="flex gap-2.5">
            <div className="flex-1 flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-white/[0.02] border border-white/5 rounded-2xl focus-within:border-primary/30 transition-colors">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-white/25 flex-shrink-0" />
              <input
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Search movies, genres, languages..."
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-white/20"
              />
              {searchInput && (
                <button onClick={() => setSearchInput('')} className="p-1 hover:bg-white/8 rounded-lg transition-colors">
                  <X className="w-3.5 h-3.5 text-white/40" />
                </button>
              )}
            </div>
            <Button variant="secondary" icon={SlidersHorizontal} onClick={() => setShowFilters(!showFilters)}>
              <span className="hidden sm:inline">Filters</span>
            </Button>
          </div>
        </motion.div>

        {/* ── Filters Panel ── */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-5 overflow-hidden"
            >
              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="mb-4">
                  <p className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.15em] mb-2">Genre</p>
                  <div className="flex flex-wrap gap-1.5">
                    {genres.map(g => (
                      <button
                        key={g}
                        onClick={() => setSelectedGenre(g)}
                        className={`px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-medium transition-all duration-200 ${
                          selectedGenre === g
                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                            : 'bg-white/4 text-white/45 hover:bg-white/8 border border-white/5'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.15em] mb-2">Language</p>
                  <div className="flex flex-wrap gap-1.5">
                    {languages.map(l => (
                      <button
                        key={l}
                        onClick={() => setSelectedLang(l)}
                        className={`px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-medium transition-all duration-200 ${
                          selectedLang === l
                            ? 'bg-accent text-white shadow-lg shadow-accent/20'
                            : 'bg-white/4 text-white/45 hover:bg-white/8 border border-white/5'
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Results Count ── */}
        <p className="text-xs sm:text-sm text-white/40 mb-5">
          {results.length} result{results.length !== 1 ? 's' : ''} found
          {searchInput && (
            <span> for "<span className="text-white font-medium">{searchInput}</span>"</span>
          )}
        </p>

        {/* ── Results Grid ── */}
        {results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {results.map((movie, i) => (
              <MovieCard key={movie.id} movie={movie} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 sm:py-20">
            <div className="w-16 h-16 rounded-full bg-white/3 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-white/20" />
            </div>
            <h3 className="text-base font-semibold mb-1.5">No results found</h3>
            <p className="text-white/40 text-sm">Try different keywords or adjust your filters</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
