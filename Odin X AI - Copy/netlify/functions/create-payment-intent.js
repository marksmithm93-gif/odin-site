require('dotenv').config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  try {
    const { plan } = JSON.parse(event.body);
    
    let amount = 0;

    // --- LOGIC: DETERMINE PRICE ---
    if (plan === 'setup_fee') {
        amount = 49900; // $499.00 (The Setup Fee)
    } else if (plan === 'Essential') {
        amount = 9900;  // $99.00
    } else if (plan === 'Growth') {
        amount = 19900; // $199.00
    } else if (plan === 'Scale') {
        amount = 29900; // $299.00
    } else {
        throw new Error("Invalid Plan Selected");
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
    console.log("Error:", error.message);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
