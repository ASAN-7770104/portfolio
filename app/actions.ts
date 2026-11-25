'use server'

import prisma from '@/lib/db'
import { cookies } from 'next/headers'

// ============================================
// CONSTANTS & TYPES
// ============================================

const RATE_LIMIT_SECONDS = 30
const RATE_LIMIT_COOKIE = 'last_view_time'

export interface ApiResponse<T = null> {
  success: boolean
  data?: T
  error?: string
  timestamp: string
  code?: string
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Проверяет rate limit через cookies
 * Возвращает количество секунд до следующего разрешенного запроса, или null если OK
 */
async function checkCookieRateLimit(): Promise<number | null> {
  const cookieStore = await cookies()
  const lastViewTime = cookieStore.get(RATE_LIMIT_COOKIE)?.value

  if (!lastViewTime) return null

  const lastTime = parseInt(lastViewTime, 10)
  const now = Date.now()
  const secondsElapsed = (now - lastTime) / 1000

  if (secondsElapsed < RATE_LIMIT_SECONDS) {
    return Math.ceil(RATE_LIMIT_SECONDS - secondsElapsed)
  }

  return null
}

/**
 * Устанавливает cookie с временем последнего просмотра
 */
async function setCookieRateLimit(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(RATE_LIMIT_COOKIE, Date.now().toString(), {
    maxAge: RATE_LIMIT_SECONDS,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  })
}

/**
 * Проверяет rate limit через базу данных
 * Защита от обхода cookie-проверки
 */
async function checkDatabaseRateLimit(): Promise<boolean> {
  try {
    const recentLog = await prisma.visitLog.findFirst({
      where: {
        timestamp: {
          gte: new Date(Date.now() - RATE_LIMIT_SECONDS * 1000),
        },
      },
      orderBy: { timestamp: 'desc' },
      take: 1,
    })

    return recentLog !== null
  } catch (error) {
    console.error('[checkDatabaseRateLimit] Error:', error)
    // В случае ошибки БД, разрешаем запрос (лучше пожертвовать защитой, чем упасть)
    return false
  }
}

/**
 * Логирует событие на сервер
 */
function serverLog(context: string, message: string, level: 'info' | 'warn' | 'error' = 'info'): void {
  const timestamp = new Date().toISOString()
  const prefix = `[${timestamp}] ${context}`

  switch (level) {
    case 'error':
      console.error(`${prefix} ❌ ${message}`)
      break
    case 'warn':
      console.warn(`${prefix} ⚠️ ${message}`)
      break
    case 'info':
      console.log(`${prefix} ℹ️ ${message}`)
      break
  }
}

// ============================================
// PUBLIC SERVER ACTIONS
// ============================================

/**
 * Получает текущую статистику просмотров и лайков
 */
export async function getStats(): Promise<ApiResponse<{ views: number; likes: number }>> {
  const context = '[getStats]'

  try {
    serverLog(context, 'Fetching statistics from database...')

    let stats = await prisma.stats.findUnique({
      where: { id: 1 },
    })

    // Auto-create если не существует
    if (!stats) {
      serverLog(context, 'Stats record not found, creating new one...')
      stats = await prisma.stats.create({
        data: { id: 1, views: 0, likes: 0 },
      })
    }

    serverLog(context, `Retrieved stats - Views: ${stats.views}, Likes: ${stats.likes}`)

    return {
      success: true,
      data: { views: stats.views, likes: stats.likes },
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    serverLog(context, `Database error: ${errorMessage}`, 'error')

    return {
      success: false,
      error: 'Не удалось загрузить статистику. Попробуйте позже.',
      code: 'STATS_FETCH_ERROR',
      timestamp: new Date().toISOString(),
    }
  }
}

/**
 * Инкрементирует счетчик просмотров с защитой от спама
 * Использует двухуровневую защиту: cookies + database
 */
export async function incrementViews(): Promise<ApiResponse<{ views: number }>> {
  const context = '[incrementViews]'

  try {
    serverLog(context, 'Processing view increment request...')

    // ========== LEVEL 1: Cookie-based Rate Limiting ==========
    const cookieWaitSeconds = await checkCookieRateLimit()
    if (cookieWaitSeconds !== null) {
      serverLog(
        context,
        `Client-side rate limit triggered. User must wait ${cookieWaitSeconds}s`,
        'warn'
      )
      return {
        success: false,
        error: `Пожалуйста, подождите ${cookieWaitSeconds} секунд перед следующим просмотром.`,
        code: 'RATE_LIMIT_COOKIE',
        timestamp: new Date().toISOString(),
      }
    }

    // ========== LEVEL 2: Database-based Rate Limiting ==========
    const isRateLimited = await checkDatabaseRateLimit()
    if (isRateLimited) {
      serverLog(context, 'Server-side rate limit triggered', 'warn')
      return {
        success: false,
        error: 'Слишком много запросов. Попробуйте позже.',
        code: 'RATE_LIMIT_DATABASE',
        timestamp: new Date().toISOString(),
      }
    }

    // ========== LEVEL 3: Log Visit ==========
    const visitLog = await prisma.visitLog.create({
      data: {},
    })
    serverLog(context, `Visit logged with ID: ${visitLog.id}`)

    // ========== LEVEL 4: Increment Stats ==========
    const updated = await prisma.stats.upsert({
      where: { id: 1 },
      update: { views: { increment: 1 } },
      create: { id: 1, views: 1, likes: 0 },
    })
    serverLog(context, `Views incremented successfully. New total: ${updated.views}`)

    // ========== LEVEL 5: Set Rate Limit Cookie ==========
    await setCookieRateLimit()
    serverLog(context, 'Rate limit cookie set')

    return {
      success: true,
      data: { views: updated.views },
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    serverLog(context, `Unexpected error: ${errorMessage}`, 'error')

    return {
      success: false,
      error: 'Не удалось увеличить счетчик. Попробуйте позже.',
      code: 'INCREMENT_ERROR',
      timestamp: new Date().toISOString(),
    }
  }
}
