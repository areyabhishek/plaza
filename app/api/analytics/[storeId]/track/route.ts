import { NextRequest, NextResponse } from 'next/server'
import { trackEvent, EventType } from '@/lib/analytics'

export async function POST(
  request: NextRequest,
  { params }: { params: { storeId: string } }
) {
  try {
    const body = await request.json()
    const { eventType, metadata } = body

    if (!eventType) {
      return NextResponse.json(
        { error: 'Event type is required' },
        { status: 400 }
      )
    }

    await trackEvent(params.storeId, eventType as EventType, metadata, request)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking event:', error)
    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    )
  }
}
