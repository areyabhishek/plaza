import { prisma } from './prisma'

export type EventType = 'PAGE_VIEW' | 'CHECKOUT_START' | 'PURCHASE' | 'EMAIL_CAPTURE'

export interface AnalyticsMetadata {
  [key: string]: any
}

/**
 * Track an analytics event
 */
export async function trackEvent(
  storeId: string,
  eventType: EventType,
  metadata?: AnalyticsMetadata,
  request?: Request
) {
  try {
    const ipAddress = request?.headers.get('x-forwarded-for') || request?.headers.get('x-real-ip') || undefined
    const userAgent = request?.headers.get('user-agent') || undefined

    await prisma.analyticsEvent.create({
      data: {
        storeId,
        eventType,
        metadata: metadata ? JSON.stringify(metadata) : undefined,
        ipAddress,
        userAgent,
      },
    })
  } catch (error) {
    console.error('Failed to track analytics event:', error)
    // Don't throw - analytics failures shouldn't break the app
  }
}

/**
 * Get analytics summary for a store
 */
export async function getStoreAnalytics(storeId: string, days: number = 30) {
  const since = new Date()
  since.setDate(since.getDate() - days)

  const events = await prisma.analyticsEvent.findMany({
    where: {
      storeId,
      createdAt: {
        gte: since,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const pageViews = events.filter(e => e.eventType === 'PAGE_VIEW').length
  const checkoutStarts = events.filter(e => e.eventType === 'CHECKOUT_START').length
  const purchases = events.filter(e => e.eventType === 'PURCHASE').length
  const emailCaptures = events.filter(e => e.eventType === 'EMAIL_CAPTURE').length

  const conversionRate = checkoutStarts > 0 ? (purchases / checkoutStarts) * 100 : 0

  // Group by date for chart data
  const eventsByDate = events.reduce((acc, event) => {
    const date = event.createdAt.toISOString().split('T')[0]
    if (!acc[date]) {
      acc[date] = { pageViews: 0, checkouts: 0, purchases: 0 }
    }
    if (event.eventType === 'PAGE_VIEW') acc[date].pageViews++
    if (event.eventType === 'CHECKOUT_START') acc[date].checkouts++
    if (event.eventType === 'PURCHASE') acc[date].purchases++
    return acc
  }, {} as Record<string, { pageViews: number; checkouts: number; purchases: number }>)

  return {
    summary: {
      pageViews,
      checkoutStarts,
      purchases,
      emailCaptures,
      conversionRate: conversionRate.toFixed(1),
    },
    chartData: Object.entries(eventsByDate).map(([date, data]) => ({
      date,
      ...data,
    })),
  }
}
