/**
 * SectionHeader.jsx — Reusable Section Title Component
 *
 * Provides consistent heading style across all homepage sections.
 * Includes an animated entrance, icon, optional subtitle, and action button.
 *
 * Props:
 * @param {string}    title     — Main heading text
 * @param {string}    subtitle  — Optional description below the title
 * @param {Component} icon      — Lucide icon displayed before the label
 * @param {string}    label     — Small uppercase label text (default: "Featured")
 * @param {string}    action    — Optional CTA text for "See All" link
 */

import { motion } from 'framer-motion'
import { Film, ChevronRight } from 'lucide-react'

export default function SectionHeader({ title, subtitle, icon: Icon = Film, label, action, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className={`flex items-end justify-between mb-6 md:mb-8 ${className}`}
    >
      <div>
        {/* Small label above title with icon */}
        <div className="flex items-center gap-2 mb-1.5">
          <Icon className="w-4 h-4 text-primary" />
          <span className="text-[11px] font-semibold text-primary uppercase tracking-[0.15em]">
            {label || title}
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-text-secondary text-xs sm:text-sm mt-1">{subtitle}</p>
        )}
      </div>
      {action && (
        <button className="flex items-center gap-1 text-xs sm:text-sm text-primary hover:text-primary-light transition-colors font-medium whitespace-nowrap group">
          {action}
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      )}
    </motion.div>
  )
}
