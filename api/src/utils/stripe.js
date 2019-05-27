import Stripe from 'stripe'

const stripe = new Stripe("sk_test_k2peDnexSaSEG0NmCmNV8Gu5")

const getStripeToken = cardData => {
  return new Promise((resolve, reject) => stripe.tokens.create({
    card: {
      number: cardData.cardNumber,
      exp_month: cardData.expiryDate.split('-')[1],
      exp_year: cardData.expiryDate.split('-')[0],
      cvc: cardData.CVC
    }
  }, function(err, token) {
    // asynchronously called
    if (err) reject(err)
    resolve(token)
  }))
}

export { getStripeToken }