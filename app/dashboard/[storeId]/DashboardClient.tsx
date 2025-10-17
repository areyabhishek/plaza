'use client'

import { useState } from 'react'
import { formatPrice } from '@/lib/utils'
import { Eye, ExternalLink, Copy, Check, Sparkles } from 'lucide-react'

type Store = {
  id: string
  slug: string
  brandName: string
  tagline: string | null
  description: string | null
  published: boolean
  products: Array<{
    id: string
    name: string
    description: string | null
    price: number
    type: string
  }>
  orders: Array<{
    id: string
    total: number
    customerEmail: string
    createdAt: string | Date
  }>
}

export default function DashboardClient({ store: initialStore }: { store: Store }) {
  const [store, setStore] = useState(initialStore)
  const [copied, setCopied] = useState(false)
  const [saving, setSaving] = useState(false)

  const storeUrl = `${window.location.origin}/@${store.slug}`
  const bioUrl = `${window.location.origin}/bio/${store.slug}`

  const handlePublish = async () => {
    setSaving(true)
    try {
      const response = await fetch(`/api/stores/${store.id}/publish`, {
        method: 'POST',
      })

      if (response.ok) {
        const data = await response.json()
        setStore({ ...store, published: data.published })
      }
    } catch (error) {
      console.error('Failed to publish store:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const updateField = async (field: string, value: any) => {
    try {
      await fetch(`/api/stores/${store.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      })
      setStore({ ...store, [field]: value })
    } catch (error) {
      console.error('Failed to update field:', error)
    }
  }

  const updateProduct = async (productId: string, field: string, value: any) => {
    try {
      await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      })

      setStore({
        ...store,
        products: store.products.map(p =>
          p.id === productId ? { ...p, [field]: value } : p
        ),
      })
    } catch (error) {
      console.error('Failed to update product:', error)
    }
  }

  const totalRevenue = store.orders.reduce((sum, order) => sum + order.total, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-8 h-8 text-purple-600" />
                {store.brandName}
              </h1>
              <p className="text-gray-600 mt-1">Manage your store</p>
            </div>
            <div className="flex gap-3">
              {!store.published ? (
                <button
                  onClick={handlePublish}
                  disabled={saving}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
                >
                  {saving ? 'Publishing...' : 'Publish Store'}
                </button>
              ) : (
                <>
                  <a
                    href={storeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700"
                  >
                    <Eye className="w-4 h-4" />
                    View Store
                  </a>
                  <button
                    onClick={() => handleCopy(storeUrl)}
                    className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    Copy Link
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm font-medium text-gray-600">Total Revenue</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">
              {formatPrice(totalRevenue)}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm font-medium text-gray-600">Orders</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">
              {store.orders.length}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm font-medium text-gray-600">Products</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">
              {store.products.length}
            </div>
          </div>
        </div>

        {/* Store Details */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Store Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Brand Name
              </label>
              <input
                type="text"
                value={store.brandName}
                onChange={(e) => updateField('brandName', e.target.value)}
                onBlur={(e) => updateField('brandName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tagline
              </label>
              <input
                type="text"
                value={store.tagline || ''}
                onChange={(e) => updateField('tagline', e.target.value)}
                onBlur={(e) => updateField('tagline', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={store.description || ''}
                onChange={(e) => updateField('description', e.target.value)}
                onBlur={(e) => updateField('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Products</h2>
          <div className="space-y-6">
            {store.products.map((product) => (
              <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      value={product.name}
                      onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
                      onBlur={(e) => updateProduct(product.id, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={product.description || ''}
                      onChange={(e) => updateProduct(product.id, 'description', e.target.value)}
                      onBlur={(e) => updateProduct(product.id, 'description', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price
                      </label>
                      <input
                        type="text"
                        value={formatPrice(product.price)}
                        onChange={(e) => {
                          const cents = Math.round(parseFloat(e.target.value.replace(/[^0-9.]/g, '')) * 100)
                          if (!isNaN(cents)) {
                            updateProduct(product.id, 'price', cents)
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type
                      </label>
                      <span className="inline-block px-3 py-2 bg-gray-100 text-gray-700 rounded-lg">
                        {product.type}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        {store.orders.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Orders</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {store.orders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.id.slice(0, 8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.customerEmail}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatPrice(order.total)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Links */}
        {store.published && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-3">Share Your Store</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-blue-700">Storefront:</span>
                <a
                  href={storeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                >
                  {storeUrl}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-blue-700">Bio Link:</span>
                <a
                  href={bioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                >
                  {bioUrl}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
