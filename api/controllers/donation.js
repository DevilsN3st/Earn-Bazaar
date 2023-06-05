
const dotenv = require("dotenv");
dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)


const stripeCheckoutSession = async(req,res) => {
    try {
      // console.log(req.body.items);
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          mode: "payment",
          line_items: req.body.items.map(item => {
            return {
              price_data: {
                currency: "usd",
                product_data: {
                  name: item.name,
                },
                unit_amount: item.priceInCents,
              },
              quantity: item.quantity,
            }
          }),
          success_url: `${process.env.CLIENT_URL}/`,
          cancel_url: `${process.env.CLIENT_URL}/cancel`,
        })
        res.json({ url: session.url })
      } catch (e) {
        console.log(e);
        res.status(500).json({ error: e.message })
      }
}

module.exports = { stripeCheckoutSession}