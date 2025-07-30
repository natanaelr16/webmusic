'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Music, Ticket, ShieldCheck, User } from 'lucide-react'
import { clsx } from 'clsx'
import { motion } from 'framer-motion'

const Navigation = () => {
  const pathname = usePathname()

  const navItems = [
    {
      name: 'Inicio',
      href: '/',
      icon: Music,
      description: 'Información del concierto'
    },
    {
      name: 'Mis Boletas',
      href: '/mis-boletas',
      icon: Ticket,
      description: 'Ver boletas compradas'
    },
    {
      name: 'Validar',
      href: '/validar',
      icon: ShieldCheck,
      description: 'Validar boletas'
    },
    {
      name: 'Acceder',
      href: '/login',
      icon: User,
      description: 'Iniciar sesión'
    }
  ]

  // Encontrar el índice del item activo
  const activeIndex = navItems.findIndex(item => item.href === pathname)

  return (
    <nav className="bg-gray-900/95 backdrop-blur-md border-b border-gray-700/50 fixed top-0 left-0 right-0 z-50 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Music className="h-8 w-8 text-blue-400" />
            <span className="text-xl font-bold text-white">
              WebMusic
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center relative bg-white/5 rounded-lg p-1">
            {/* Sliding indicator background - solo si hay un item activo */}
            {activeIndex !== -1 && (
              <motion.div
                className="absolute bg-gradient-to-r from-blue-500/40 to-purple-500/40 backdrop-blur-sm rounded-md border border-blue-400/60 shadow-lg"
                layoutId="activeTab"
                style={{
                  width: `calc(${100 / navItems.length}% - 4px)`,
                  height: 'calc(100% - 8px)',
                  top: 4,
                  left: `calc(${activeIndex * (100 / navItems.length)}% + 2px)`,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 40
                }}
                initial={false}
              />
            )}

            {navItems.map((item, index) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={clsx(
                    'flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 relative z-10 min-w-[120px] justify-center',
                    isActive
                      ? 'text-white font-semibold'
                      : 'text-white/70 hover:text-white/90 hover:bg-white/5'
                  )}
                  title={item.description}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-white/80 hover:text-white p-2 transition-colors rounded-lg hover:bg-white/10">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Hidden for now, can be toggled */}
      <div className="md:hidden hidden border-t border-white/20">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  'flex items-center space-x-3 px-3 py-2 rounded-lg text-base font-medium transition-all duration-200',
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

export { Navigation }