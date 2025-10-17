import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia',
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { storeId, productIds } = body

    if (!storeId || !productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { error: 'Store ID and product IDs are required' },
        { status: 400 }
      )
    }

    // Fetch store and products
    const store = await prisma.store.findUnique({
      where: { id: storeId },
    })

    if (!store) {
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      )
    }

    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        storeId,
        active: true,
      },
    })

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: 'Some products not found or inactive' },
        { status: 400 }
      )
    }

    // Create pending order
    const order = await prisma.order.create({
      data: {
        storeId,
        customerEmail: 'pending@checkout.com', // Will be updated after payment
        total: products.reduce((sum, p) => sum + p.price, 0),
        status: 'PENDING',
        items: {
          create: products.map(p => ({
            productId: p.id,
            quantity: 1,
            price: p.price,
          })),
        },
      },
    })

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: products.map(product => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            description: product.description || undefined,
          },
          unit_amount: product.price,
        },
        quantity: 1,
      })),
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/@${store.slug}`,
      metadata: {
        orderId: order.id,
        storeId: store.id,
      },
    })

    // Update order with session ID
    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
