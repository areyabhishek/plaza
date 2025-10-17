import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { storeId: string } }
) {
  try {
    const body = await request.json()
    const { brandName, tagline, description, heroImage } = body

    const store = await prisma.store.update({
      where: { id: params.storeId },
      data: {
        ...(brandName !== undefined && { brandName }),
        ...(tagline !== undefined && { tagline }),
        ...(description !== undefined && { description }),
        ...(heroImage !== undefined && { heroImage }),
      },
    })

    return NextResponse.json({ success: true, store })
  } catch (error) {
    console.error('Error updating store:', error)
    return NextResponse.json(
      { error: 'Failed to update store' },
      { status: 500 }
    )
  }
}
