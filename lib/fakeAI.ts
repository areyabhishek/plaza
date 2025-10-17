/**
 * Fake AI utilities for MVP
 * Replace with real LLM later
 */

export interface BusinessIdea {
  raw: string
  brandName: string
  tagline: string
  description: string
  productSuggestions: Array<{
    name: string
    description: string
    price: number
    type: 'DIGITAL' | 'SERVICE'
  }>
}

/**
 * Parse a one-line business idea and generate brand + products
 */
export function parseBusinessIdea(idea: string): BusinessIdea {
  // Very simple deterministic template
  const cleaned = idea.trim()

  // Extract potential brand name from the idea
  const words = cleaned.split(' ')
  const brandName = words
    .slice(0, Math.min(3, words.length))
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')

  // Generate a tagline
  const tagline = `${brandName} - Your trusted partner`

  // Generate description
  const description = `Welcome to ${brandName}! ${cleaned}. We're here to help you succeed.`

  // Generate 2 sample products based on keywords
  const hasDigital = /ebook|course|template|guide|download|pdf/i.test(cleaned)
  const hasService = /coaching|consulting|service|session|call|mentoring/i.test(cleaned)

  const productSuggestions = []

  if (hasDigital || !hasService) {
    productSuggestions.push({
      name: `${brandName} Starter Guide`,
      description: `Complete guide to get started with ${brandName}`,
      price: 2900, // $29.00
      type: 'DIGITAL' as const,
    })
  }

  if (hasService || productSuggestions.length === 0) {
    productSuggestions.push({
      name: `1-on-1 Consultation`,
      description: `Personal consultation session to help you achieve your goals`,
      price: 9900, // $99.00
      type: 'SERVICE' as const,
    })
  }

  // Ensure we always have 2 products
  if (productSuggestions.length === 1) {
    if (productSuggestions[0].type === 'DIGITAL') {
      productSuggestions.push({
        name: `${brandName} Workshop`,
        description: `Interactive workshop to dive deeper`,
        price: 14900, // $149.00
        type: 'SERVICE' as const,
      })
    } else {
      productSuggestions.push({
        name: `${brandName} Toolkit`,
        description: `Essential templates and resources`,
        price: 4900, // $49.00
        type: 'DIGITAL' as const,
      })
    }
  }

  return {
    raw: cleaned,
    brandName,
    tagline,
    description,
    productSuggestions: productSuggestions.slice(0, 2),
  }
}

/**
 * Generate social media share content
 */
export function generateShareContent(storeName: string, storeUrl: string) {
  return {
    twitter: `🎉 Just launched my store: ${storeName}! Check it out at ${storeUrl}`,
    facebook: `I'm excited to share my new store with you! ${storeName} is now live. Visit ${storeUrl} to see what I'm offering.`,
    linkedin: `I'm thrilled to announce the launch of ${storeName}! You can explore my offerings at ${storeUrl}. Looking forward to your support!`,
    generic: `Check out my new store: ${storeName}\n${storeUrl}`,
  }
}

/**
 * Suggest improvements (placeholder for future AI features)
 */
export function suggestImprovements(storeData: any) {
  return {
    suggestions: [
      'Add more product images to increase conversions',
      'Consider offering a bundle discount',
      'Add customer testimonials to build trust',
    ],
  }
}
