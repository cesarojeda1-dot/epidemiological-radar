// Placeholder Stripe service - does not run without env keys
const Stripe = require('stripe')
const stripe = process.env.STRIPE_SECRET ? Stripe(process.env.STRIPE_SECRET) : null

module.exports = {
  createPaymentIntent: async (amount,currency='usd') =>{
    if(!stripe) throw new Error('Stripe not configured')
    return await stripe.paymentIntents.create({amount, currency})
  }
}
