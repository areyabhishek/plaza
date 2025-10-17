# Plaza - Creator Storefront Builder

Launch a complete storefront with checkout and bio link in seconds - just describe your business in one sentence!

[![GitHub](https://img.shields.io/github/stars/areyabhishek/plaza?style=social)](https://github.com/areyabhishek/plaza)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Stripe](https://img.shields.io/badge/Stripe-Integrated-blueviolet)](https://stripe.com/)

## Features

- **One-Line Setup**: Type one sentence about your business and get a working store instantly
- **Inline Editing**: Edit all content (brand name, products, prices) directly in the dashboard
- **Payment Processing**: Stripe Checkout integration for accepting payments
- **Public Pages**:
  - Storefront (`/@brandname`) with product listing and checkout
  - Bio link (`/bio/brandname`) for social media profiles
- **Email Marketing**: Automatic email capture and welcome emails
- **Analytics**: Track page views, checkout starts, and purchases
- **Share Tools**: Pre-written social media posts after first sale

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Prisma + SQLite (easy to swap for PostgreSQL/MySQL)
- **Auth**: NextAuth with email magic links
- **Payments**: Stripe Checkout
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Stripe account (for payments)

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Copy `.env.example` to `.env` and fill in the values:
   ```bash
   cp .env.example .env
   ```

   Required environment variables:
   ```env
   # Database
   DATABASE_URL="file:./dev.db"

   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-here"  # Generate with: openssl rand -base64 32

   # Stripe (get from https://dashboard.stripe.com/test/apikeys)
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."  # From Stripe CLI or webhook dashboard

   # App Config
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

3. **Initialize the database**:
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Stripe Setup

### For Development

1. **Get your API keys**:
   - Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
   - Copy your test mode publishable and secret keys
   - Add them to `.env`

2. **Set up webhooks** (for order completion):

   **Option A: Using Stripe CLI (Recommended for local development)**
   ```bash
   # Install Stripe CLI: https://stripe.com/docs/stripe-cli
   stripe login
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   # Copy the webhook signing secret to .env as STRIPE_WEBHOOK_SECRET
   ```

   **Option B: Using Stripe Dashboard**
   - Go to [Stripe Webhooks](https://dashboard.stripe.com/test/webhooks)
   - Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Select event: `checkout.session.completed`
   - Copy the signing secret to `.env`

## Usage Guide

### Creating Your First Store

1. Visit the homepage at `http://localhost:3000`
2. Enter a one-sentence description of your business, e.g.:
   - "I help busy parents with meal planning and healthy recipes"
   - "I teach yoga and mindfulness through online courses"
   - "I create custom digital art and illustrations"
3. Click "Launch My Store"
4. You'll be redirected to your dashboard where you can edit everything

### Editing Your Store

In the dashboard, you can:
- Edit brand name, tagline, and description (changes save on blur)
- Update product names, descriptions, and prices
- View sales and revenue
- See recent orders

### Publishing Your Store

1. Click "Publish Store" in the dashboard
2. Share your storefront link: `/@yourbrandname`
3. Share your bio link: `/bio/yourbrandname`

### Testing Payments

Use Stripe test cards:
- **Success**: `4242 4242 4242 4242`
- Any future expiry date
- Any 3-digit CVC
- Any billing ZIP code

## Project Structure

```
├── app/
│   ├── @[slug]/              # Public storefront pages
│   ├── api/
│   │   ├── auth/             # NextAuth endpoints
│   │   ├── checkout/         # Stripe checkout
│   │   ├── stores/           # Store CRUD operations
│   │   ├── products/         # Product updates
│   │   ├── analytics/        # Event tracking
│   │   └── webhooks/         # Stripe webhooks
│   ├── bio/[slug]/           # Bio link pages
│   ├── dashboard/[storeId]/  # Store management
│   ├── success/              # Post-checkout page
│   └── page.tsx              # Landing page
├── lib/
│   ├── prisma.ts             # Database client
│   ├── auth.ts               # NextAuth config
│   ├── fakeAI.ts             # Business idea parser (MVP)
│   ├── analytics.ts          # Analytics utilities
│   ├── email.ts              # Email sending
│   └── utils.ts              # Helper functions
├── prisma/
│   └── schema.prisma         # Database schema
└── .env                      # Environment variables
```

## Database Schema

The app uses the following main models:

- **User**: User accounts (for NextAuth)
- **Store**: Creator stores with branding
- **Product**: Digital products and services
- **Order**: Customer purchases
- **EmailLead**: Email subscribers
- **AnalyticsEvent**: Tracking events

## Key API Routes

- `POST /api/stores/create` - Create a new store from business idea
- `PATCH /api/stores/[id]` - Update store details
- `POST /api/stores/[id]/publish` - Publish store
- `POST /api/stores/[id]/capture-email` - Capture email lead
- `POST /api/checkout` - Create Stripe checkout session
- `POST /api/webhooks/stripe` - Handle Stripe webhooks
- `POST /api/analytics/[storeId]/track` - Track analytics event

## Deployment

### Deploy to Vercel

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. **Deploy to Vercel**:
   - Connect your GitHub repository to Vercel
   - Add environment variables in Vercel dashboard
   - Update `NEXT_PUBLIC_APP_URL` to your production domain

3. **Upgrade database** (for production):
   - Use [Neon](https://neon.tech) or [Supabase](https://supabase.com) for PostgreSQL
   - Update `DATABASE_URL` in environment variables
   - Change Prisma provider to `postgresql` in `schema.prisma`
   - Run migrations: `npx prisma migrate deploy`

4. **Set up Stripe webhook**:
   - Add webhook endpoint in Stripe dashboard
   - Point to: `https://yourdomain.com/api/webhooks/stripe`
   - Update `STRIPE_WEBHOOK_SECRET`

## Email Configuration (Optional)

For production email delivery:

1. **Using Resend**:
   ```bash
   npm install resend
   ```
   Update `lib/email.ts` to use Resend API

2. **Using Postmark**:
   - Sign up at [Postmark](https://postmarkapp.com)
   - Add API key to environment
   - Update email functions in `lib/email.ts`

## Roadmap / Future Features

- [ ] Real LLM integration (OpenAI, Anthropic)
- [ ] File uploads for digital product delivery
- [ ] Custom domains
- [ ] Email campaigns and automation
- [ ] Advanced analytics dashboard
- [ ] Subscription billing
- [ ] Multi-currency support
- [ ] Template marketplace
- [ ] Team collaboration

## Contributing

This is an MVP built from the PRD. Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## License

MIT

## Support

For questions or issues, please open a GitHub issue.

---

**Built with Next.js 14, Prisma, Stripe, and Tailwind CSS**
