require('dotenv').config();
// The server reads the Secret Key from Netlify settings automatically
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  try {
    const { plan } = JSON.parse(event.body);
    let amount = 0;

    // Price Logic (in cents)
    if (plan === 'setup_fee') {
        amount = 49900; // $499.00
    } else if (plan === 'Essential') {
        amount = 9900;
    } else if (plan === 'Growth') {
        amount = 19900;
    } else if (plan === 'Scale') {
        amount = 29900;
    } else {
        return { statusCode: 400, body: JSON.stringify({ error: "Invalid Plan" }) };
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: { plan_name: plan }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
    };
  } catch (error) {
    return { statusCode: 400, body: JSON.stringify({ error: error.message }) };
  }
};
