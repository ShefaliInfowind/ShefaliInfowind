const stripe = require('stripe')('sk_test_51F9P3IB6xjyE8yubz7DoJEdm2v8uh1voTACPOPsbTfDwFQnGwUuaLNfABxZaZK7d07PForUmfa6dqNHJaiiSIQTF00JhmNJlPW')

async function postCharge(req, res) {
  console.log('datataaa',req.body);
  try {
    console.log('request',req.body);
    const { amount, source, receipt_email } = req.body

    const charge = await stripe.charges.create({
      amount,
      currency: 'USD',
      source,
      receipt_email
    })
    console.log("charge",charge)
    if (!charge) throw new Error('charge unsuccessful')
    
    res.status(200).json({
      charge,
      message: 'charge posted successfully'
    })
  } catch (error) {
    console.log('chargeerror',error)
    res.status(500).json({
      message: error.message
    })
  }
}

module.exports = postCharge