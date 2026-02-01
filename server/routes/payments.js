const express = require('express');
const router = express.Router();

// Initialize Stripe with secret key
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create a Payment Intent
router.post('/create-payment-intent', async (req, res) => {
    try {
        const { amount, currency = 'inr', metadata = {} } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                error: 'Invalid amount'
            });
        }

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Stripe expects amount in cents
            currency,
            description: `Travel Booking: ${metadata.tripName || 'New Trip'}`, // Required for India exports
            shipping: {
                name: req.body.customerName || 'Valued Traveler',
                address: {
                    line1: '123 Travelogue St',
                    city: 'Mumbai',
                    state: 'MH',
                    postal_code: '400001',
                    country: 'IN',
                },
            },
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                ...metadata,
                integration: 'travelogue_booking'
            }
        });

        res.json({
            success: true,
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });
    } catch (error) {
        console.error('Stripe error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Confirm payment and update booking status
router.post('/confirm-payment', async (req, res) => {
    try {
        const { paymentIntentId, bookingId } = req.body;

        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status === 'succeeded') {
            // Update booking status in database if needed
            // This would typically update the booking to 'paid' status
            res.json({
                success: true,
                status: paymentIntent.status,
                message: 'Payment confirmed successfully'
            });
        } else {
            res.json({
                success: false,
                status: paymentIntent.status,
                message: 'Payment not yet completed'
            });
        }
    } catch (error) {
        console.error('Payment confirmation error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Webhook endpoint for Stripe events (optional, for production)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        if (endpointSecret) {
            event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        } else {
            event = req.body;
        }

        // Handle the event
        switch (event.type) {
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object;
                console.log('Payment succeeded:', paymentIntent.id);
                // Update booking status, send confirmation email, etc.
                break;
            case 'payment_intent.payment_failed':
                console.log('Payment failed:', event.data.object.id);
                break;
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        res.json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(400).send(`Webhook Error: ${error.message}`);
    }
});

module.exports = router;
