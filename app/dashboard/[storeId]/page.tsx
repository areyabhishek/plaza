import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import DashboardClient from './DashboardClient'

export default async function DashboardPage({
  params,
}: {
  params: { storeId: string }
}) {
  const store = await prisma.store.findUnique({
    where: { id: params.storeId },
    include: {
      products: {
        where: { active: true },
        orderBy: { createdAt: 'asc' },
      },
      orders: {
        where: { status: 'COMPLETED' },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  })

  if (!store) {
    redirect('/')
  }

  return <DashboardClient store={store} />
}
