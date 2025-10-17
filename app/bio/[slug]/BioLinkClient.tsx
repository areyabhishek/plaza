'use client'

import { useState, useEffect } from 'react'
import { formatPrice } from '@/lib/utils'
import { ExternalLink, Mail, ShoppingBag } from 'lucide-react'

type Store = {
  id: string
  slug: string
  brandName: string
  tagline: string | null
  description: string | null
  products: Array<{
    id: string
    name: string
    price: number
  }>
}

export default function BioLinkClient({ store }: { store: Store }) {
  const [email, setEmail] = useState('')
  const [emailSubmitted, setEmailSubmitted] = useState(false)

  useEffect(() => {
    // Track page view
    fetch(`/api/analytics/${store.id}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventType: 'PAGE_VIEW', metadata: { source: 'bio' } }),
    }).catch(() => {})
  }, [store.id])

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    try {
      const response = await fetch(`/api/stores/${store.id}/capture-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'bio' }),
      })

      if (response.ok) {
        setEmailSubmitted(true)
        setEmail('')
      }
    } catch (error) {
      console.error('Failed to capture email:', error)
    }
  }

  const storeUrl = `${window.location.origin}/@${store.slug}`

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Profile Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          {/* Avatar */}
          <div className="text-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-4xl font-bold text-white">
                {store.brandName.charAt(0)}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{store.brandName}</h1>
            {store.tagline && (
              <p className="text-blue-200 text-lg">{store.tagline}</p>
            )}
          </div>

          {/* Description */}
          {store.description && (
            <p className="text-white/90 text-center mb-6 px-4">
              {store.description}
            </p>
          )}

          {/* Links */}
          <div className="space-y-3 mb-6">
            <a
              href={storeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-white hover:bg-blue-50 text-gray-900 py-4 px-6 rounded-xl font-semibold text-center transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              Visit My Store
              <ExternalLink className="w-4 h-4" />
            </a>

            {store.products.length > 0 && (
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
                <h3 className="text-white font-semibold mb-3 text-center">
                  Featured Products
                </h3>
                <div className="space-y-2">
                  {store.products.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between text-white/90"
                    >
                      <span className="text-sm">{product.name}</span>
                      <span className="text-sm font-semibold">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Email Capture */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 shadow-lg">
            <div className="text-center mb-4">
              <Mail className="w-8 h-8 mx-auto mb-2 text-white" />
              <h3 className="text-white font-bold text-lg">Stay Connected</h3>
              <p className="text-blue-100 text-sm">Get updates & exclusive offers</p>
            </div>

            {emailSubmitted ? (
              <div className="text-center py-3">
                <p className="text-white font-semibold">Thanks!</p>
                <p className="text-blue-100 text-sm mt-1">
                  Check your email for updates.
                </p>
              </div>
            ) : (
              <form onSubmit={handleEmailSubmit} className="space-y-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-white text-purple-600 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-white/60 text-sm">
            Create your own with Business in a Box
          </p>
        </div>
      </div>
    </div>
  )
}
