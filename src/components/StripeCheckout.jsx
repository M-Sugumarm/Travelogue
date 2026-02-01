import React, { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
    Elements,
    PaymentElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js'
import { FaLock, FaCheck, FaSpinner } from 'react-icons/fa'

// Initialize Stripe with publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '')

// Checkout Form Component
function CheckoutForm({ onSuccess, onError, amount, tripName }) {
    const stripe = useStripe()
    const elements = useElements()
    const [isProcessing, setIsProcessing] = useState(false)
    const [message, setMessage] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!stripe || !elements) {
            return
        }

        setIsProcessing(true)
        setMessage('')

        try {
            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/my-bookings`,
                },
                redirect: 'if_required',
            })

            if (error) {
                setMessage(error.message || 'Payment failed')
                onError?.(error)
            } else if (paymentIntent && (paymentIntent.status === 'succeeded' || paymentIntent.status === 'processing')) {
                setMessage('Payment successful!')
                onSuccess?.(paymentIntent)
            }
        } catch (err) {
            setMessage('An unexpected error occurred.')
            onError?.(err)
        }

        setIsProcessing(false)
    }

    return (
        <form onSubmit={handleSubmit} className="stripe-checkout-form">
            <div className="payment-summary">
                <h4>Payment Details</h4>
                <p className="trip-name">{tripName}</p>
                <div className="amount-display">
                    <span>Total Amount:</span>
                    <strong>₹{amount?.toLocaleString('en-IN')}</strong>
                </div>
            </div>

            <PaymentElement
                options={{
                    layout: 'tabs',
                }}
            />

            {message && (
                <div className={`payment-message ${message.includes('successful') ? 'success' : 'error'}`}>
                    {message}
                </div>
            )}

            <button
                type="submit"
                disabled={!stripe || isProcessing}
                className="btn-primary payment-btn"
            >
                {isProcessing ? (
                    <>
                        <FaSpinner className="spinner" /> Processing...
                    </>
                ) : (
                    <>
                        <FaLock /> Pay ₹{amount?.toLocaleString('en-IN')}
                    </>
                )}
            </button>

            <div className="secure-badge">
                <FaLock /> Secured by Stripe
            </div>
        </form>
    )
}

// Main Stripe Checkout Component
export default function StripeCheckout({
    amount,
    tripId,
    tripName,
    customerName,
    onSuccess,
    onError,
    onCancel,
    isOpen,
    inline = false // New prop
}) {
    const [clientSecret, setClientSecret] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        if ((isOpen || inline) && amount > 0) {
            createPaymentIntent()
        }
    }, [isOpen, inline, amount])

    const createPaymentIntent = async () => {
        try {
            setLoading(true)
            setError('')

            const response = await fetch('http://localhost:5000/api/payments/create-payment-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount,
                    currency: 'inr',
                    metadata: {
                        tripId,
                        tripName,
                        customerName,
                    },
                    customerName,
                }),
            })

            const data = await response.json()

            if (data.success) {
                setClientSecret(data.clientSecret)
            } else {
                setError(data.error || 'Failed to initialize payment')
            }
        } catch (err) {
            setError('Failed to connect to payment server')
            console.error('Payment init error:', err)
        } finally {
            setLoading(false)
        }
    }

    const options = React.useMemo(() => ({
        clientSecret,
        appearance: {
            theme: 'night',
            variables: {
                colorPrimary: '#ff7a59',
                colorBackground: '#0f172a',
                colorText: '#ffffff',
                colorDanger: '#ef4444',
                fontFamily: 'Inter, system-ui, sans-serif',
                borderRadius: '12px',
            },
        },
    }), [clientSecret]);

    const content = (
        <>
            {!inline && (
                <div className="checkout-header">
                    <h2>Complete Your Booking</h2>
                    <p>Secure payment powered by Stripe</p>
                </div>
            )}
            {/* ... header ... */}
            {loading ? (
                <div className="checkout-loading">
                    <FaSpinner className="spinner" />
                    <p>Preparing secure checkout...</p>
                </div>
            ) : error ? (
                <div className="checkout-error">
                    <p>{error}</p>
                    <button className="btn-secondary" onClick={createPaymentIntent}>
                        Try Again
                    </button>
                </div>
            ) : clientSecret ? (
                <Elements stripe={stripePromise} options={options}>
                    <CheckoutForm
                        amount={amount}
                        tripName={tripName}
                        onSuccess={onSuccess}
                        onError={onError}
                    />
                </Elements>
            ) : null}
        </>
    )

    if (inline) return <div className="stripe-inline-container">{content}</div>
    if (!isOpen) return null

    return (
        <div className="stripe-checkout-overlay" onClick={onCancel}>
            <div className="stripe-checkout-modal" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onCancel}>×</button>
                {content}
            </div>
        </div>
    )
}
