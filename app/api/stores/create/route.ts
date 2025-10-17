import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { parseBusinessIdea } from '@/lib/fakeAI'
import { slugify } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { idea } = body

    if (!idea || typeof idea !== 'string') {
      return NextResponse.json(
        { error: 'Business idea is required' },
        { status: 400 }
      )
    }

    // Parse the business idea using fake AI
    const parsed = parseBusinessIdea(idea)

    // Generate unique slug and brandName
    let brandName = parsed.brandName
    let slug = slugify(brandName)
    let slugSuffix = 0

    // Ensure both slug and brandName are unique
    while (
      await prisma.store.findFirst({
        where: {
          OR: [
            { slug },
            { brandName }
          ]
        }
      })
    ) {
      slugSuffix++
      brandName = `${parsed.brandName} ${slugSuffix}`
      slug = `${slugify(parsed.brandName)}-${slugSuffix}`
    }

    // For MVP, we'll create a temporary user session
    // In production, this would require authentication
    const tempEmail = `temp-${Date.now()}@example.com`

    let user = await prisma.user.findUnique({
      where: { email: tempEmail },
    })

    if (!user) {
      user = await prisma.user.create({
        data: { email: tempEmail },
      })
    }

    // Create the store
    const store = await prisma.store.create({
      data: {
        userId: user.id,
        brandName,
        slug,
        tagline: parsed.tagline,
        description: parsed.description,
        published: false,
      },
    })

    // Create the sample products
    await Promise.all(
      parsed.productSuggestions.map(product =>
        prisma.product.create({
          data: {
            storeId: store.id,
            name: product.name,
            description: product.description,
            price: product.price,
            type: product.type,
            active: true,
          },
        })
      )
    )

    return NextResponse.json({
      success: true,
      store: {
        id: store.id,
        slug: store.slug,
        brandName: store.brandName,
      },
    })
  } catch (error) {
    console.error('Error creating store:', error)
    return NextResponse.json(
      { error: 'Failed to create store' },
      { status: 500 }
    )
  }
}
