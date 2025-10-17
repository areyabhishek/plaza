/**
 * AI utilities using Claude 3.5 Sonnet
 * Generates brand names, taglines, and product suggestions
 */

import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
})

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
 * Parse a one-line business idea using Claude AI
 */
export async function parseBusinessIdea(idea: string): Promise<BusinessIdea> {
  // If no API key, fall back to deterministic mode
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('⚠️  ANTHROPIC_API_KEY not set. Using fallback mode.')
    return fallbackParser(idea)
  }

  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `You are a branding expert helping creators launch their online stores.

Based on this business idea: "${idea}"

Generate a JSON response with:
1. brandName: A catchy, memorable brand name (2-3 words max)
2. tagline: A compelling tagline (under 60 characters)
3. description: A short description for the store (2-3 sentences)
4. productSuggestions: An array of exactly 2 products to sell

For each product include:
- name: Product name
- description: Brief description (1-2 sentences)
- price: Price in cents (reasonable for the product type)
- type: Either "DIGITAL" or "SERVICE"

Rules:
- Make the brand name unique and professional
- Keep prices realistic ($29-$149 range typically)
- Mix product types if possible (one digital, one service)
- Be creative but practical

Return ONLY valid JSON, no markdown or explanation.`,
        },
      ],
    })

    // Extract text from Claude's response
    const content = message.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude')
    }

    // Parse the JSON response
    const parsed = JSON.parse(content.text)

    return {
      raw: idea,
      brandName: parsed.brandName,
      tagline: parsed.tagline,
      description: parsed.description,
      productSuggestions: parsed.productSuggestions.map((p: any) => ({
        name: p.name,
        description: p.description,
        price: p.price,
        type: p.type as 'DIGITAL' | 'SERVICE',
      })),
    }
  } catch (error) {
    console.error('Claude API error:', error)
    console.log('Falling back to deterministic parser')
    return fallbackParser(idea)
  }
}

/**
 * Fallback parser when API key is not available
 */
function fallbackParser(idea: string): BusinessIdea {
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
