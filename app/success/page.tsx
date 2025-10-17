'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Check, Copy, Twitter, Facebook, Linkedin } from 'lucide-react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [showShareModal, setShowShareModal] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Show share modal after a short delay
    const timer = setTimeout(() => {
      setShowShareModal(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const shareText = "Just made my first sale! 🎉"
  const shareUrl = "https://businessinabox.com" // Update with actual URL

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareToTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      '_blank'
    )
  }

  const shareToFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      '_blank'
    )
  }

  const shareToLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      '_blank'
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>

          <p className="text-gray-600 mb-6">
            Thank you for your purchase. You&apos;ll receive a confirmation email shortly.
          </p>

          {sessionId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Session ID</p>
              <p className="text-xs font-mono text-gray-800 break-all">
                {sessionId}
              </p>
            </div>
          )}

          <a
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
          >
            Return Home
          </a>
        </div>

        {/* Share Modal */}
        {showShareModal && (
          <div className="mt-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-2 text-center">
              Congrats on your first sale! 🎉
            </h2>
            <p className="text-blue-100 mb-6 text-center">
              Share the excitement with your network
            </p>

            <div className="space-y-3">
              <button
                onClick={shareToTwitter}
                className="w-full bg-white hover:bg-blue-50 text-gray-900 py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
              >
                <Twitter className="w-5 h-5 text-blue-400" />
                Share on Twitter
              </button>

              <button
                onClick={shareToFacebook}
                className="w-full bg-white hover:bg-blue-50 text-gray-900 py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
              >
                <Facebook className="w-5 h-5 text-blue-600" />
                Share on Facebook
              </button>

              <button
                onClick={shareToLinkedIn}
                className="w-full bg-white hover:bg-blue-50 text-gray-900 py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
              >
                <Linkedin className="w-5 h-5 text-blue-700" />
                Share on LinkedIn
              </button>

              <button
                onClick={() => handleCopy(shareText)}
                className="w-full bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 border border-white/30"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                {copied ? 'Copied!' : 'Copy Message'}
              </button>
            </div>

            <button
              onClick={() => setShowShareModal(false)}
              className="mt-4 text-white/80 hover:text-white text-sm underline block mx-auto"
            >
              Maybe later
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
