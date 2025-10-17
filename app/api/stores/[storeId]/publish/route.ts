import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { storeId: string } }
) {
  try {
    const store = await prisma.store.update({
      where: { id: params.storeId },
      data: { published: true },
    })

    return NextResponse.json({ success: true, published: store.published })
  } catch (error) {
    console.error('Error publishing store:', error)
    return NextResponse.json(
      { error: 'Failed to publish store' },
      { status: 500 }
    )
  }
}
