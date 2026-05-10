/**
 * Button.jsx — Multi-Variant Button Component
 *
 * The primary interactive element across the app. Designed to
 * feel premium with micro-animations on hover/tap.
 *
 * Variants: primary, secondary, outline, ghost, accent, glass, success
 * Sizes:    xs, sm, md, lg, xl
 *
 * Features:
 * - Framer Motion hover/tap scale effects
 * - Loading spinner state
 * - Left & right icon support
 * - Disabled state with reduced opacity
 *
 * Usage:
 *   <Button variant="primary" size="lg" icon={Ticket}>Book Now</Button>
 *   <Button variant="glass" loading>Processing...</Button>
 */

import { motion } from 'framer-motion'

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
  iconRight: IconRight,
  loading = false,
  disabled = false,
  ...props
}) {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 cursor-pointer select-none whitespace-nowrap'

  const variants = {
    primary: 'bg-gradient-to-r from-primary to-primary-dark hover:from-primary-light hover:to-primary text-white shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:shadow-xl',
    secondary: 'bg-surface-lighter hover:bg-white/10 text-white border border-border hover:border-border-light',
    outline: 'border border-primary/40 text-primary hover:bg-primary/10 hover:border-primary/70',
    ghost: 'text-text-secondary hover:text-white hover:bg-white/5',
    accent: 'bg-gradient-to-r from-accent to-accent-dark hover:brightness-110 text-white shadow-lg shadow-accent/20',
    glass: 'glass text-white hover:bg-white/10',
    success: 'bg-success/90 hover:bg-success text-white shadow-lg shadow-success/20',
  }

  const sizes = {
    xs: 'px-2.5 py-1.5 text-[11px] gap-1.5 rounded-lg',
    sm: 'px-3.5 py-2 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3 text-sm gap-2.5',
    xl: 'px-10 py-4 text-base gap-3',
  }

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      className={`${baseClasses} ${variants[variant] || variants.primary} ${sizes[size]} ${disabled ? 'opacity-40 pointer-events-none' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : Icon ? (
        <Icon className="w-4 h-4 flex-shrink-0" />
      ) : null}
      {children}
      {IconRight && <IconRight className="w-4 h-4 flex-shrink-0" />}
    </motion.button>
  )
}
