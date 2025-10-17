# Quick Start Guide

## Get Running in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Claude AI (Optional but Recommended)

Plaza uses Claude 3.5 Sonnet to generate creative brand names and products. Without it, you'll get basic template-based generation.

1. **Get your API key**:
   - Go to [https://console.anthropic.com/](https://console.anthropic.com/)
   - Create an account or log in
   - Go to API Keys section
   - Create a new API key (starts with `sk-ant-`)

2. **Add to `.env`**:
   ```env
   ANTHROPIC_API_KEY="sk-ant-your_key_here"
   ```

**Note:** If you skip this step, Plaza will still work - it will use a simple fallback mode for brand generation.

### 3. Set Up Stripe (Required for Payments)

1. **Create a Stripe account** at [stripe.com](https://stripe.com) (or log in)
2. **Get your test API keys**:
   - Go to [https://dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys)
   - Copy your **Publishable key** (starts with `pk_test_`)
   - Copy your **Secret key** (starts with `sk_test_`)
3. **Add keys to `.env`**:
   ```env
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_key_here"
   STRIPE_SECRET_KEY="sk_test_your_key_here"
   ```

### 4. Set Up Stripe Webhooks (for Order Completion)

**Option A: Using Stripe CLI** (Recommended for local dev)
```bash
# Install Stripe CLI: https://stripe.com/docs/stripe-cli
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

This will output a webhook signing secret like `whsec_...`. Copy it and add to `.env`:
```env
STRIPE_WEBHOOK_SECRET="whsec_your_secret_here"
```

Keep the Stripe CLI running in a separate terminal while developing.

**Option B: Manual Setup** (Less ideal for local development)
- You can skip webhooks for now - payments will work, but order confirmation emails won't send

### 5. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Create Your First Store

1. Enter a business idea in one sentence, for example:
   - "I teach yoga and mindfulness through online courses"
   - "I help busy parents with meal planning and healthy recipes"
   - "I create custom digital art and illustrations"

2. Click "Launch My Store"

3. Edit your store in the dashboard:
   - Update brand name, tagline, description
   - Edit product names, descriptions, and prices
   - Click "Publish Store" when ready

4. Visit your public storefront at `http://localhost:3000/@yourbrandname`

5. Visit your bio link at `http://localhost:3000/bio/yourbrandname`

## Test a Purchase

1. Go to your published storefront
2. Select a product
3. Click "Checkout Now"
4. Use Stripe test card:
   - Card number: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits

5. Complete the purchase
6. You'll see the order in your dashboard!

## What's Next?

- **Add Real Email**: Configure Resend or Postmark in `lib/email.ts`
- **Deploy**: Follow the deployment guide in README.md
- **Customize**: The codebase is fully yours to modify!

## Troubleshooting

**Build errors?**
```bash
rm -rf .next
npm run build
```

**Database issues?**
```bash
npx prisma migrate reset
npx prisma migrate dev
```

**Port already in use?**
```bash
lsof -ti:3000 | xargs kill  # Kill process on port 3000
npm run dev
```

## File Structure

```
app/
├── page.tsx              # Landing page (enter business idea)
├── [username]/           # Public storefront (/@brand)
├── bio/[slug]/          # Bio link page (/bio/brand)
├── dashboard/[storeId]/ # Store management dashboard
├── success/             # Post-checkout success page
└── api/                 # API routes
    ├── stores/          # Store CRUD
    ├── products/        # Product updates
    ├── checkout/        # Stripe checkout
    ├── webhooks/        # Stripe webhooks
    └── analytics/       # Event tracking

lib/
├── prisma.ts            # Database client
├── fakeAI.ts            # Business idea parser
├── analytics.ts         # Analytics tracking
├── email.ts             # Email sending
└── utils.ts             # Helper functions
```

## Need Help?

Check the full [README.md](README.md) for:
- Detailed setup instructions
- Deployment guides
- Email configuration
- Production best practices

---

**Happy building! 🚀**
