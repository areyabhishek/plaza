'use client'

import { useState, useEffect } from 'react'
import { formatPrice } from '@/lib/utils'
import { ShoppingCart, Mail } from 'lucide-react'

type Store = {
  id: string
  slug: string
  brandName: string
  tagline: string | null
  description: string | null
  products: Array<{
    id: string
    name: string
    description: string | null
    price: number
    type: string
  }>
}

export default function StorefrontClient({ store }: { store: Store }) {
  const [selectedProducts, setSelectedProducts] = useState<Record<string, boolean>>({})
  const [email, setEmail] = useState('')
  const [emailSubmitted, setEmailSubmitted] = useState(false)

  useEffect(() => {
    // Track page view
    fetch(`/api/analytics/${store.id}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventType: 'PAGE_VIEW' }),
    }).catch(() => {})
  }, [store.id])

  const handleCheckout = async () => {
    const productIds = Object.keys(selectedProducts).filter(id => selectedProducts[id])

    if (productIds.length === 0) {
      alert('Please select at least one product')
      return
    }

    // Track checkout start
    fetch(`/api/analytics/${store.id}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventType: 'CHECKOUT_START' }),
    }).catch(() => {})

    // Create Stripe checkout session
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        storeId: store.id,
        productIds,
      }),
    })

    if (response.ok) {
      const { url } = await response.json()
      window.location.href = url
    } else {
      alert('Failed to start checkout')
    }
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    try {
      const response = await fetch(`/api/stores/${store.id}/capture-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setEmailSubmitted(true)
        setEmail('')
      }
    } catch (error) {
      console.error('Failed to capture email:', error)
    }
  }

  const toggleProduct = (productId: string) => {
    setSelectedProducts(prev => ({
      ...prev,
      [productId]: !prev[productId],
    }))
  }

  const selectedTotal = store.products
    .filter(p => selectedProducts[p.id])
    .reduce((sum, p) => sum + p.price, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-5xl font-bold mb-4">{store.brandName}</h1>
          {store.tagline && (
            <p className="text-xl text-blue-100 mb-6">{store.tagline}</p>
          )}
          {store.description && (
            <p className="text-lg text-blue-50 max-w-2xl mx-auto">{store.description}</p>
          )}
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Products & Services
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {store.products.map((product) => (
            <div
              key={product.id}
              onClick={() => toggleProduct(product.id)}
              className={`bg-white rounded-lg shadow-lg p-6 cursor-pointer transition-all border-2 ${
                selectedProducts[product.id]
                  ? 'border-blue-600 shadow-xl'
                  : 'border-transparent hover:border-blue-300'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {product.name}
                  </h3>
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                    {product.type}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatPrice(product.price)}
                  </div>
                </div>
              </div>

              {product.description && (
                <p className="text-gray-600 mb-4">{product.description}</p>
              )}

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedProducts[product.id] || false}
                  onChange={() => toggleProduct(product.id)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {selectedProducts[product.id] ? 'Selected' : 'Select this item'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Checkout Button */}
        {Object.values(selectedProducts).some(v => v) && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-gray-900">Total:</span>
              <span className="text-3xl font-bold text-blue-600">
                {formatPrice(selectedTotal)}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-6 h-6" />
              Checkout Now
            </button>
          </div>
        )}

        {/* Email Capture */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-lg p-8 text-white">
          <div className="text-center mb-6">
            <Mail className="w-12 h-12 mx-auto mb-3 opacity-90" />
            <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
            <p className="text-blue-100">
              Get the latest updates and exclusive offers
            </p>
          </div>

          {emailSubmitted ? (
            <div className="text-center py-4">
              <p className="text-lg font-semibold">Thanks for subscribing!</p>
              <p className="text-blue-100 mt-1">Check your email for a welcome message.</p>
            </div>
          ) : (
            <form onSubmit={handleEmailSubmit} className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white"
                required
              />
              <button
                type="submit"
                className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            Powered by Plaza
          </p>
        </div>
      </div>
    </div>
  )
}
