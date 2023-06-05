const router = require('express').Router();


const { stripeCheckoutSession } = require('../controllers/donation')

router.post('/create-checkout-session', stripeCheckoutSession )


module.exports = router;
