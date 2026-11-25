'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Users, Heart, Clock } from 'lucide-react'
import { getStats, incrementViews } from './actions'

// ============================================
// ANIMATED COUNTER COMPONENT
// ============================================
function AnimatedCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (count >= target) return
    const duration = 1500
    const increment = target / (duration / 16)
    let current = count

    const interval = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(interval)
      } else {
        setCount(Math.floor(current))
      }
    }, 16)

    return () => clearInterval(interval)
  }, [target, count])

  return <span>{count.toLocaleString('ru-RU')}</span>
}

// ============================================
// LOADING SKELETON WITH SHIMMER
// ============================================
function LoadingSkeleton() {
  const shimmerClass = 'bg-gradient-to-r from-[#FBFBFB] via-white to-[#FBFBFB] bg-[length:1000px_100%] animate-shimmer'

  return (
    <div className="space-y-6">
      <div className={`h-12 w-40 rounded-full mx-auto ${shimmerClass}`} />
      <div className={`h-32 w-56 rounded-4xl mx-auto ${shimmerClass}`} />
      <div className={`h-10 w-44 rounded-full mx-auto ${shimmerClass}`} />
    </div>
  )
}

// ============================================
// PROFILE HEADER COMPONENT
// ============================================
function ProfileHeader() {
  return (
    <motion.div
      className="text-center space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Badge */}
      <motion.div
        className="inline-block"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <span className="text-xs font-semibold text-emerald-950 uppercase tracking-widest bg-emerald-100 px-4 py-2 rounded-full">
          🎯 Senior Developer
        </span>
      </motion.div>

      {/* Main Title - Serif Font */}
      <motion.h1
        className="text-6xl sm:text-7xl lg:text-8xl font-bold font-serif text-[#1F2937] tracking-tight"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        Асан
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className="text-base sm:text-lg text-slate-600 font-light max-w-xl mx-auto leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        Fullstack разработчик из Астаны. Создаю масштабируемые веб-приложения с фокусом на производительность и пользовательский опыт.
      </motion.p>
    </motion.div>
  )
}

// ============================================
// STATS CARDS COMPONENT (2-COLUMN GRID)
// ============================================
function StatsCards({ stats, isLoading, onViewsClick, isIncrementLoading, viewError }: any) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.4,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4 },
    },
  }

  if (isLoading) {
    return <LoadingSkeleton />
  }

  return (
    <motion.div
      className="grid grid-cols-2 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Visitors Card */}
      <motion.button
        onClick={onViewsClick}
        disabled={isIncrementLoading}
        variants={itemVariants}
        className="group relative bg-white rounded-4xl p-8 shadow-soft hover:shadow-elegant transition-all duration-300 hover:border-emerald-200 border-2 border-white active:scale-95 disabled:opacity-75"
      >
        {/* Icon Background */}
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-6 group-hover:bg-emerald-200 transition-colors">
          <Users className="w-8 h-8 text-emerald-950" strokeWidth={1.5} />
        </div>

        {/* Label */}
        <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest mb-2">Посещения</p>

        {/* Counter */}
        <div className="text-4xl font-bold text-emerald-950 mb-3">
          {stats?.views ? <AnimatedCounter target={stats.views} /> : '0'}
        </div>

        {/* Error */}
        {viewError && (
          <p className="text-xs text-red-600 font-medium">{viewError.substring(0, 30)}...</p>
        )}

        {/* Loading */}
        {isIncrementLoading && (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-emerald-950 rounded-full animate-pulse" />
            <p className="text-xs text-slate-600">Обновление...</p>
          </div>
        )}
      </motion.button>

      {/* Likes Card */}
      <motion.div
        variants={itemVariants}
        className="group bg-white rounded-4xl p-8 shadow-soft hover:shadow-elegant transition-all duration-300 border-2 border-white hover:border-emerald-200"
      >
        {/* Icon Background */}
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-6 group-hover:bg-emerald-200 transition-colors">
          <Heart className="w-8 h-8 text-emerald-950" strokeWidth={1.5} fill="currentColor" />
        </div>

        {/* Label */}
        <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest mb-2">Одобрение</p>

        {/* Counter */}
        <div className="text-4xl font-bold text-emerald-950 mb-3">{stats?.likes ?? '0'}</div>

        {/* Hint */}
        <p className="text-xs text-slate-500">Спасибо за поддержку!</p>
      </motion.div>
    </motion.div>
  )
}

// ============================================
// BUTTON GROUP COMPONENT
// ============================================
function ButtonGroup() {
  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.5 + custom * 0.1, duration: 0.5 },
    }),
  }

  return (
    <motion.div className="flex flex-col sm:flex-row gap-4 justify-center">
      {/* Primary CTA - Emerald */}
      <motion.button
        custom={0}
        variants={buttonVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="group relative overflow-hidden bg-emerald-950 text-white px-10 py-4 rounded-full font-semibold text-lg hover:shadow-elegant transition-all duration-300"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
        <span className="relative">Посмотреть проекты</span>
      </motion.button>

      {/* Secondary CTA - Outline */}
      <motion.button
        custom={1}
        variants={buttonVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="group relative overflow-hidden bg-white text-emerald-950 px-10 py-4 rounded-full font-semibold text-lg border-2 border-emerald-950 hover:shadow-elegant transition-all duration-300"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-100 to-transparent translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
        <span className="relative">Связаться</span>
      </motion.button>
    </motion.div>
  )
}

// ============================================
// FLOATING TOAST COMPONENT (Rate Limit Notification)
// ============================================
function NotificationToast({ error, isVisible }: { error?: string; isVisible: boolean }) {
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    if (!error?.includes('подождите')) return

    const match = error.match(/(\d+)\s*сек/)
    if (match) {
      setCountdown(parseInt(match[1], 10))
    }
  }, [error])

  useEffect(() => {
    if (countdown <= 0) return

    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, x: 20 }}
      animate={isVisible ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, y: 20, x: 20 }}
      exit={{ opacity: 0, y: 20, x: 20 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-8 right-8 max-w-sm bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4 shadow-elegant"
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex-shrink-0 mt-1">
          <Clock className="w-5 h-5 text-emerald-950 animate-pulse-soft" />
        </div>

        {/* Content */}
        <div className="flex-1">
          <p className="text-sm font-semibold text-emerald-950">Rate Limit</p>
          <p className="text-xs text-emerald-800 mt-1">
            Пожалуйста, подождите{' '}
            <span className="font-bold text-emerald-950">{countdown}с</span>
          </p>
        </div>
      </div>
    </motion.div>
  )
}

// ============================================
// MAIN HOME PAGE
// ============================================
export default function Home() {
  const [stats, setStats] = useState<{ views: number; likes: number } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewError, setViewError] = useState<string | null>(null)
  const [isIncrementLoading, setIsIncrementLoading] = useState(false)

  const showToast = useMemo(() => viewError?.includes('подождите') || false, [viewError])

  // Load stats on mount
  useEffect(() => {
    const loadStats = async () => {
      setIsLoading(true)
      setError(null)

      const response = await getStats()
      if (response.success && response.data) {
        setStats(response.data)
      } else {
        setError(response.error || 'Ошибка загрузки статистики')
      }

      setIsLoading(false)
    }

    loadStats()
  }, [])

  // Handle views increment
  const handleIncrementViews = async () => {
    setIsIncrementLoading(true)
    setViewError(null)

    const response = await incrementViews()

    if (response.success && response.data) {
      setStats((prev) => (prev ? { ...prev, views: response.data!.views } : null))
      setViewError(null)
    } else {
      setViewError(response.error || 'Ошибка увеличения счетчика')
    }

    setIsIncrementLoading(false)
  }

  return (
    <main className="min-h-screen bg-[#FBFBFB] text-[#1F2937] flex flex-col items-center justify-center px-4 sm:px-6 py-12 sm:py-16">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-32 left-1/4 w-96 h-96 rounded-full bg-emerald-100/20 blur-3xl"
          animate={{ y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-32 right-1/4 w-96 h-96 rounded-full bg-emerald-100/10 blur-3xl"
          animate={{ y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      {/* Main Container */}
      <div className="w-full max-w-3xl space-y-12">
        {/* ====== SECTION 1: Profile Header ====== */}
        <ProfileHeader />

        {/* ====== SECTION 2: Stats Cards (2-Column Grid) ====== */}
        <StatsCards
          stats={stats}
          isLoading={isLoading}
          onViewsClick={handleIncrementViews}
          isIncrementLoading={isIncrementLoading}
          viewError={viewError}
        />

        {/* ====== SECTION 3: CTA Buttons ====== */}
        <ButtonGroup />

        {/* ====== SECTION 4: Footer ====== */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center pt-8 border-t border-emerald-100"
        >
          <p className="text-sm text-slate-600 font-light">
            Сделано с <span className="text-emerald-950">♥</span> на React 19, Next.js 16, Tailwind CSS & PostgreSQL
          </p>
        </motion.div>
      </div>

      {/* ====== TOAST NOTIFICATIONS ====== */}
      <NotificationToast error={viewError || undefined} isVisible={showToast} />
    </main>
  )
}