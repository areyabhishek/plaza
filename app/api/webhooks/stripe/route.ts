import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendOrderConfirmation } from '@/lib/email'
import { trackEvent } from '@/lib/analytics'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature' },
        { status: 400 }
      )
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session

      const orderId = session.metadata?.orderId
      const storeId = session.metadata?.storeId

      if (!orderId || !storeId) {
        console.error('Missing metadata in webhook')
        return NextResponse.json({ received: true })
      }

      // Update order status
      const order = await prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'COMPLETED',
          customerEmail: session.customer_details?.email || 'unknown@email.com',
          customerName: session.customer_details?.name || undefined,
          stripePaymentId: session.payment_intent as string,
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      })

      // Track purchase event
      await trackEvent(storeId, 'PURCHASE', {
        orderId: order.id,
        total: order.total,
        productCount: order.items.length,
      })

      // Send order confirmation email
      await sendOrderConfirmation(order.customerEmail, {
        orderId: order.id,
        items: order.items.map(item => ({
          name: item.product.name,
          price: item.price,
        })),
        total: order.total,
      })
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
