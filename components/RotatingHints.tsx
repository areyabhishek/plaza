'use client'

import { useState, useEffect } from 'react'

const hints = [
  "I am a designer, and I want to sell my Figma templates.",
  "I am a coach, and I want to offer 1:1 sessions online.",
  "I am a musician, and I want to sell my song packs.",
  "I am a YouTuber, and I want to sell access to my community.",
  "I am a photographer, and I want to sell presets and guides.",
]

export default function RotatingHints() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [fade, setFade] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % hints.length)
        setFade(true)
      }, 300)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="text-center mt-6">
      <p className="text-sm text-gray-500 mb-3">Examples for inspiration:</p>
      <p
        className={`text-gray-400 italic transition-opacity duration-300 ${
          fade ? 'opacity-100' : 'opacity-0'
        }`}
      >
        "{hints[currentIndex]}"
      </p>
    </div>
  )
}
