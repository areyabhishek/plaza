'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, ArrowRight } from 'lucide-react'
import RotatingHints from '@/components/RotatingHints'

export default function HomePage() {
  const [idea, setIdea] = useState('I am a teacher, and I want to sell lesson planning courses.')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!idea.trim()) return

    setLoading(true)
    try {
      const response = await fetch('/api/stores/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: idea.trim() }),
      })

      if (!response.ok) {
        throw new Error('Failed to create store')
      }

      const data = await response.json()
      router.push(`/dashboard/${data.store.id}`)
    } catch (error) {
      console.error('Error creating store:', error)
      alert('Failed to create store. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-purple-950 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Plaza</h1>
          <p className="text-gray-400 text-sm">Launch your store with AI</p>
        </div>

        {/* Main Input Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center">
            <input
              type="text"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="I am a teacher, and I want to sell lesson planning courses."
              autoFocus
              disabled={loading}
              className="w-full text-center text-2xl md:text-4xl font-medium bg-transparent border-none text-white placeholder-gray-500 focus:outline-none focus:ring-0 px-4 py-6"
              style={{
                textShadow: '0 2px 20px rgba(59, 130, 246, 0.3)',
              }}
            />
          </div>

          {/* Rotating Hints */}
          <RotatingHints />

          {/* Submit Button */}
          <div className="flex justify-center mt-12">
            <button
              type="submit"
              disabled={loading || !idea.trim()}
              className="group relative inline-flex items-center justify-center gap-3 px-12 py-5 bg-white text-gray-900 text-lg font-semibold rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-2xl hover:shadow-blue-500/50"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating your store...
                </>
              ) : (
                <>
                  Start building with AI
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Features Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-xl mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="font-semibold text-white mb-2">Instant Setup</h3>
            <p className="text-sm text-gray-400">Store ready in seconds with AI</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-xl mb-4">
              <span className="text-2xl">💳</span>
            </div>
            <h3 className="font-semibold text-white mb-2">Accept Payments</h3>
            <p className="text-sm text-gray-400">Stripe checkout built-in</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-xl mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="font-semibold text-white mb-2">Track Everything</h3>
            <p className="text-sm text-gray-400">Analytics and insights included</p>
          </div>
        </div>

        {/* Footer Link */}
        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500">
            Already have a store?{' '}
            <a href="/auth/signin" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
