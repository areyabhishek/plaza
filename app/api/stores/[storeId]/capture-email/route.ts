import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendWelcomeEmail } from '@/lib/email'
import { trackEvent } from '@/lib/analytics'

export async function POST(
  request: NextRequest,
  { params }: { params: { storeId: string } }
) {
  try {
    const body = await request.json()
    const { email, source = 'storefront' } = body

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const store = await prisma.store.findUnique({
      where: { id: params.storeId },
    })

    if (!store) {
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      )
    }

    // Check if email already exists
    const existing = await prisma.emailLead.findUnique({
      where: {
        storeId_email: {
          storeId: params.storeId,
          email,
        },
      },
    })

    if (existing) {
      return NextResponse.json({ success: true, message: 'Already subscribed' })
    }

    // Create email lead
    await prisma.emailLead.create({
      data: {
        storeId: params.storeId,
        email,
        source,
        welcomed: true,
      },
    })

    // Track email capture event
    await trackEvent(params.storeId, 'EMAIL_CAPTURE', { email, source }, request)

    // Send welcome email
    const storeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/@${store.slug}`
    await sendWelcomeEmail(email, store.brandName, storeUrl)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error capturing email:', error)
    return NextResponse.json(
      { error: 'Failed to capture email' },
      { status: 500 }
    )
  }
}
