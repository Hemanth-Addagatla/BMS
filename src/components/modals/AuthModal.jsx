import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { X, Mail, Lock, User, Eye, EyeOff, Chrome } from 'lucide-react'
import Button from '../ui/Button'
import toast from 'react-hot-toast'

export default function AuthModal({ isOpen, onClose }) {
  const [mode, setMode] = useState('login')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast.success(mode === 'login' ? 'Welcome back! 🎬' : 'Account created successfully! 🎉')
      onClose()
    }, 1500)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[80]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed inset-0 flex items-center justify-center z-[90] p-4"
          >
            <div className="w-full max-w-md glass rounded-3xl overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="relative p-6 pb-4">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-display font-bold mb-1">
                    {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                  </h2>
                  <p className="text-sm text-text-secondary">
                    {mode === 'login'
                      ? 'Sign in to continue your cinematic journey'
                      : 'Join CineBook for an amazing experience'}
                  </p>
                </div>

                {/* Google Sign In */}
                <button className="w-full flex items-center justify-center gap-3 py-3 bg-white/5 hover:bg-white/10 border border-border rounded-xl transition-all duration-300 mb-4">
                  <Chrome className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">Continue with Google</span>
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-text-muted">or</span>
                  <div className="flex-1 h-px bg-border" />
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
                {mode === 'register' && (
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-border rounded-xl text-sm outline-none focus:border-primary/50 focus:bg-white/8 transition-all placeholder:text-text-muted"
                    />
                  </div>
                )}

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-border rounded-xl text-sm outline-none focus:border-primary/50 focus:bg-white/8 transition-all placeholder:text-text-muted"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    className="w-full pl-10 pr-12 py-3 bg-white/5 border border-border rounded-xl text-sm outline-none focus:border-primary/50 focus:bg-white/8 transition-all placeholder:text-text-muted"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-lg"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 text-text-muted" /> : <Eye className="w-4 h-4 text-text-muted" />}
                  </button>
                </div>

                {mode === 'login' && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-xs text-text-secondary cursor-pointer">
                      <input type="checkbox" className="accent-primary w-3.5 h-3.5 rounded" />
                      Remember me
                    </label>
                    <button type="button" className="text-xs text-primary hover:text-primary-light">
                      Forgot Password?
                    </button>
                  </div>
                )}

                <Button type="submit" variant="primary" size="lg" className="w-full" loading={loading}>
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                </Button>

                <p className="text-center text-sm text-text-secondary">
                  {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                  <button
                    type="button"
                    onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                    className="text-primary hover:text-primary-light font-medium"
                  >
                    {mode === 'login' ? 'Sign Up' : 'Sign In'}
                  </button>
                </p>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
