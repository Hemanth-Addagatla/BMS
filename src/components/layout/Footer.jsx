/**
 * Footer.jsx — Site-wide Footer Component
 *
 * Always visible at the bottom of every page (rendered in App.jsx).
 *
 * Structure:
 * 1. App Download Banner — Gradient CTA for mobile app
 * 2. Main Footer Grid — Brand column + 3 link columns
 * 3. Contact Row — Email, phone, location
 * 4. Bottom Bar — Copyright + Made in India
 *
 * The footer uses a dark surface background with subtle borders
 * to create visual separation from page content above.
 */

import { Film, Facebook, Twitter, Instagram, Youtube, Smartphone, Mail, Phone, MapPin, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'

const footerLinks = {
  company: [
    { label: 'About Us', path: '#' },
    { label: 'Contact Us', path: '#' },
    { label: 'Press', path: '#' },
    { label: 'Careers', path: '#' },
    { label: 'Corporate Bookings', path: '#' },
  ],
  help: [
    { label: 'Help & Support', path: '#' },
    { label: 'FAQs', path: '#' },
    { label: 'Terms & Conditions', path: '#' },
    { label: 'Privacy Policy', path: '#' },
    { label: 'Sitemap', path: '#' },
  ],
  discover: [
    { label: 'Movies in Mumbai', path: '#' },
    { label: 'Movies in Delhi', path: '#' },
    { label: 'Movies in Bangalore', path: '#' },
    { label: 'Events Near You', path: '#' },
    { label: 'Upcoming Movies', path: '#' },
  ],
}

const socials = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Youtube, href: '#', label: 'YouTube' },
]

export default function Footer() {
  return (
    <footer className="bg-[#0e0e0e] border-t border-white/4 mt-0">
      {/* ── App Download Banner ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="relative bg-gradient-to-r from-primary/12 via-accent/12 to-primary/12 rounded-2xl p-5 sm:p-7 border border-white/5 overflow-hidden mb-10 sm:mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/3 to-accent/3" />
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg flex-shrink-0">
                <Smartphone className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-display font-bold">Get the CineBook App</h3>
                <p className="text-xs sm:text-sm text-white/40">Book faster, unlock exclusive offers, and never miss a show.</p>
              </div>
            </div>
            <div className="flex gap-2.5">
              <button className="px-4 sm:px-5 py-2 bg-white text-black rounded-xl text-xs sm:text-sm font-semibold hover:bg-gray-100 transition-colors">
                <span className="text-[9px] sm:text-[10px] block text-gray-500">Download on</span>
                App Store
              </button>
              <button className="px-4 sm:px-5 py-2 bg-white text-black rounded-xl text-xs sm:text-sm font-semibold hover:bg-gray-100 transition-colors">
                <span className="text-[9px] sm:text-[10px] block text-gray-500">Get it on</span>
                Google Play
              </button>
            </div>
          </div>
        </div>

        {/* ── Main Footer Grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-10">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Film className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-display font-bold text-lg">
                Cine<span className="text-primary">Book</span>
              </span>
            </Link>
            <p className="text-xs text-white/35 mb-4 leading-relaxed max-w-[200px]">
              India's premier movie ticket booking platform. Experience cinema like never before.
            </p>
            <div className="flex gap-1.5">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg bg-white/4 hover:bg-primary/15 hover:text-primary flex items-center justify-center transition-all duration-300 border border-white/4 hover:border-primary/20"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-display font-semibold text-[11px] uppercase tracking-[0.15em] text-white/35 mb-3">
                {title}
              </h4>
              <ul className="space-y-2">
                {links.map(({ label, path }) => (
                  <li key={label}>
                    <Link
                      to={path}
                      className="text-xs text-white/30 hover:text-primary transition-colors duration-200"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Contact Row ── */}
        <div className="flex flex-wrap gap-4 sm:gap-6 py-5 border-t border-white/4 mb-5">
          <a href="#" className="flex items-center gap-2 text-xs text-white/35 hover:text-primary transition-colors">
            <Mail className="w-3.5 h-3.5" /> support@cinebook.com
          </a>
          <a href="#" className="flex items-center gap-2 text-xs text-white/35 hover:text-primary transition-colors">
            <Phone className="w-3.5 h-3.5" /> 1800-123-4567
          </a>
          <span className="flex items-center gap-2 text-xs text-white/35">
            <MapPin className="w-3.5 h-3.5" /> Mumbai, India
          </span>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 border-t border-white/4">
          <p className="text-[10px] text-white/20">
            © 2026 CineBook. All rights reserved.
          </p>
          <p className="text-[10px] text-white/20 flex items-center gap-1">
            Made with <Heart className="w-2.5 h-2.5 text-primary fill-primary" /> in India
          </p>
        </div>
      </div>
    </footer>
  )
}
