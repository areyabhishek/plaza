/**
 * Email utilities
 * For MVP, this logs to console
 * Replace with Postmark/Resend in production
 */

export interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

/**
 * Send an email
 */
export async function sendEmail(options: EmailOptions) {
  // For development, just log the email
  console.log('📧 EMAIL SENT:')
  console.log('To:', options.to)
  console.log('Subject:', options.subject)
  console.log('Body:', options.text || options.html)
  console.log('---')

  // In production, integrate with your email provider:
  /*
  const response = await fetch('https://api.postmarkapp.com/email', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Postmark-Server-Token': process.env.POSTMARK_API_KEY!,
    },
    body: JSON.stringify({
      From: process.env.EMAIL_FROM,
      To: options.to,
      Subject: options.subject,
      HtmlBody: options.html,
      TextBody: options.text,
    }),
  })
  */

  return { success: true }
}

/**
 * Send welcome email to new lead
 */
export async function sendWelcomeEmail(email: string, storeName: string, storeUrl: string) {
  return sendEmail({
    to: email,
    subject: `Welcome to ${storeName}!`,
    html: `
      <h1>Welcome to ${storeName}!</h1>
      <p>Thanks for signing up! We're excited to have you.</p>
      <p>Visit your store at: <a href="${storeUrl}">${storeUrl}</a></p>
      <p>Stay tuned for updates and special offers!</p>
    `,
    text: `
      Welcome to ${storeName}!

      Thanks for signing up! We're excited to have you.

      Visit your store at: ${storeUrl}

      Stay tuned for updates and special offers!
    `,
  })
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmation(
  email: string,
  orderDetails: {
    orderId: string
    items: Array<{ name: string; price: number }>
    total: number
  }
) {
  const itemsList = orderDetails.items
    .map(item => `- ${item.name}: $${(item.price / 100).toFixed(2)}`)
    .join('\n')

  return sendEmail({
    to: email,
    subject: `Order Confirmation - #${orderDetails.orderId}`,
    html: `
      <h1>Thank you for your order!</h1>
      <p>Order #${orderDetails.orderId}</p>
      <h2>Items:</h2>
      <ul>
        ${orderDetails.items.map(item => `<li>${item.name}: $${(item.price / 100).toFixed(2)}</li>`).join('')}
      </ul>
      <p><strong>Total: $${(orderDetails.total / 100).toFixed(2)}</strong></p>
    `,
    text: `
      Thank you for your order!

      Order #${orderDetails.orderId}

      Items:
      ${itemsList}

      Total: $${(orderDetails.total / 100).toFixed(2)}
    `,
  })
}
