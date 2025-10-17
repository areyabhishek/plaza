import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import BioLinkClient from './BioLinkClient'

export default async function BioLinkPage({
  params,
}: {
  params: { slug: string }
}) {
  const store = await prisma.store.findUnique({
    where: { slug: params.slug, published: true },
    include: {
      products: {
        where: { active: true },
        orderBy: { createdAt: 'asc' },
        take: 3,
      },
    },
  })

  if (!store) {
    notFound()
  }

  return <BioLinkClient store={store} />
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const store = await prisma.store.findUnique({
    where: { slug: params.slug, published: true },
  })

  if (!store) {
    return {
      title: 'Bio Link Not Found',
    }
  }

  return {
    title: `${store.brandName} - Link in Bio`,
    description: store.tagline || `All links for ${store.brandName}`,
  }
}
