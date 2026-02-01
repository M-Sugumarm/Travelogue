import React, { useEffect, useState } from 'react';
import { FaCheck, FaDownload, FaCopy, FaHome, FaPlane, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import '../styles/PaymentSuccess.css';

export default function PaymentSuccess({ trip, bookingDetails, formData, totalPrice, onClose }) {
    const [copied, setCopied] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [confetti, setConfetti] = useState([]);

    useEffect(() => {
        // Generate confetti
        const colors = ['#FF7A59', '#10b981', '#3b82f6', '#f59e0b', '#ec4899'];
        const newConfetti = Array.from({ length: 50 }).map((_, i) => ({
            id: i,
            left: Math.random() * 100 + '%',
            animationDuration: Math.random() * 3 + 2 + 's',
            animationDelay: Math.random() * 2 + 's',
            backgroundColor: colors[Math.floor(Math.random() * colors.length)]
        }));
        setConfetti(newConfetti);
    }, []);

    const handleCopyId = () => {
        if (bookingDetails?.bookingId) {
            navigator.clipboard.writeText(bookingDetails.bookingId);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleDownload = () => {
        setDownloading(true);
        // Simulate download
        setTimeout(() => {
            setDownloading(false);
            // Ideally trigger a real PDF download here
        }, 1500);
    };

    return (
        <div className="payment-success-overlay">
            {confetti.map(c => (
                <div
                    key={c.id}
                    className="confetti"
                    style={{
                        left: c.left,
                        animationDuration: c.animationDuration,
                        animationDelay: c.animationDelay,
                        backgroundColor: c.backgroundColor
                    }}
                />
            ))}

            <div className="success-icon-container">
                <div className="success-icon-circle">
                    <FaCheck />
                </div>
            </div>

            <div className="ticket-card">
                <div className="ticket-header">
                    <h3>Boarding Pass</h3>
                    <p>Flight to Adventure Ready</p>
                </div>

                <div className="ticket-body">
                    <div className="ticket-row">
                        <div>
                            <span className="ticket-label">Passenger</span>
                            <span className="ticket-value">{formData.name}</span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <span className="ticket-label">Destination</span>
                            <span className="ticket-value">{trip.title}</span>
                        </div>
                    </div>

                    <div className="ticket-row">
                        <div>
                            <span className="ticket-label">Date</span>
                            <span className="ticket-value">
                                {new Date(formData.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <span className="ticket-label">Travelers</span>
                            <span className="ticket-value">{formData.travelers}</span>
                        </div>
                    </div>

                    <div className="ticket-divider"></div>

                    <div className="ticket-row" style={{ marginBottom: 0 }}>
                        <div>
                            <span className="ticket-label">Total Paid</span>
                            <span className="ticket-value" style={{ color: '#10b981' }}>
                                ₹{totalPrice.toLocaleString('en-IN')}
                            </span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <span className="ticket-label">Status</span>
                            <span className="ticket-value">CONFIRMED</span>
                        </div>
                    </div>

                    <div className="booking-id-container" onClick={handleCopyId} title="Click to copy">
                        <div>
                            <span className="ticket-label" style={{ marginBottom: 0, fontSize: '0.7rem' }}>Booking Ref</span>
                            <div className="booking-id-text">
                                {bookingDetails?.bookingId || 'TRIP-12345'}
                            </div>
                        </div>
                        <div className="copy-icon">
                            {copied ? <FaCheck color="#10b981" /> : <FaCopy />}
                        </div>
                    </div>
                </div>
            </div>

            <div className="success-actions">
                <button className="btn-download" onClick={handleDownload}>
                    {downloading ? 'Saving...' : <><FaDownload /> Ticket</>}
                </button>
                <button className="btn-finish" onClick={onClose}>
                    Awesome! <FaPlane style={{ marginLeft: 8 }} />
                </button>
            </div>
        </div>
    );
}
