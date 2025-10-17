import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import StorefrontClient from './StorefrontClient'

export default async function StorefrontPage({
  params,
}: {
  params: { username: string }
}) {
  // Remove @ prefix if present
  const slug = params.username.replace(/^@/, '')

  const store = await prisma.store.findUnique({
    where: { slug, published: true },
    include: {
      products: {
        where: { active: true },
        orderBy: { createdAt: 'asc' },
      },
    },
  })

  if (!store) {
    notFound()
  }

  return <StorefrontClient store={store} />
}

export async function generateMetadata({ params }: { params: { username: string } }) {
  const slug = params.username.replace(/^@/, '')

  const store = await prisma.store.findUnique({
    where: { slug, published: true },
  })

  if (!store) {
    return {
      title: 'Store Not Found',
    }
  }

  return {
    title: `${store.brandName} - ${store.tagline || 'Shop Now'}`,
    description: store.description || `Check out ${store.brandName} products`,
  }
}
