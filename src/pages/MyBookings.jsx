import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { getBookings, cancelBooking } from '../services/api';
import { FaCalendarAlt, FaUsers, FaMapMarkerAlt, FaClock, FaTicketAlt, FaTimesCircle, FaCheckCircle, FaPlane, FaShieldAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function MyBookings() {
    const { userEmail, setUserEmail, showToast } = useApp();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState(userEmail || '');

    const fetchUserBookings = async (emailToUse) => {
        if (!emailToUse) return;

        setLoading(true);
        try {
            const response = await getBookings(emailToUse);
            setBookings(response.data || []);
        } catch (error) {
            showToast('Failed to load bookings', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userEmail) {
            fetchUserBookings(userEmail);
        }
    }, [userEmail]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (email) {
            setUserEmail(email);
            fetchUserBookings(email);
        }
    };

    const handleCancel = async (bookingId) => {
        if (!confirm('Are you sure you want to cancel this booking?')) return;

        try {
            await cancelBooking(bookingId);
            showToast('Booking cancelled successfully', 'success');
            fetchUserBookings(userEmail);
        } catch (error) {
            showToast('Failed to cancel booking', 'error');
        }
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            confirmed: '#10b981',
            pending: '#f59e0b',
            completed: '#6366f1',
            cancelled: '#ef4444'
        };
        return colors[status] || '#6b7280';
    };

    return (
        <div className="container my-bookings-page">
            <div className="bookings-header">
                <div>
                    <h1>✈️ My Bookings</h1>
                    <p className="muted">Track your adventures and manage reservations</p>
                </div>
            </div>

            {!userEmail && (
                <div className="email-lookup-card">
                    <div className="lookup-icon">🔍</div>
                    <h3>Find Your Bookings</h3>
                    <p>Enter the email address you used when booking</p>
                    <form onSubmit={handleSearch} className="email-form">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            required
                        />
                        <button type="submit" className="btn glow">
                            Find Bookings
                        </button>
                    </form>
                </div>
            )}

            {userEmail && (
                <>
                    <div className="bookings-email-bar">
                        <span>Showing bookings for: <strong>{userEmail}</strong></span>
                        <button
                            className="btn ghost"
                            onClick={() => { setUserEmail(''); setBookings([]); }}
                        >
                            Change Email
                        </button>
                    </div>

                    {loading ? (
                        <div className="loading-state">
                            <div className="loader"></div>
                            <p>Loading your bookings...</p>
                        </div>
                    ) : bookings.length === 0 ? (
                        <div className="empty-bookings">
                            <div className="empty-icon">📭</div>
                            <h3>No Bookings Found</h3>
                            <p>You haven't made any bookings with this email yet.</p>
                            <Link to="/book" className="btn glow">Browse Trips</Link>
                        </div>
                    ) : (
                        <div className="bookings-grid">
                            {bookings.map(booking => (
                                <div key={booking.bookingId} className="booking-card">
                                    <div
                                        className="booking-image"
                                        style={{ backgroundImage: `url(${booking.tripImage})` }}
                                    >
                                        <div
                                            className="booking-status"
                                            style={{ backgroundColor: getStatusColor(booking.status) }}
                                        >
                                            {booking.status === 'confirmed' && <FaCheckCircle />}
                                            {booking.status === 'cancelled' && <FaTimesCircle />}
                                            {booking.status}
                                        </div>
                                    </div>

                                    <div className="booking-content">
                                        <h3>{booking.tripTitle}</h3>

                                        <div className="booking-details">
                                            <div className="detail-row">
                                                <FaTicketAlt />
                                                <span>Booking ID: <strong>{booking.bookingId}</strong></span>
                                            </div>
                                            <div className="detail-row">
                                                <FaCalendarAlt />
                                                <span>{formatDate(booking.startDate)}</span>
                                            </div>
                                            <div className="detail-row">
                                                <FaUsers />
                                                <span>{booking.travelers} {booking.travelers === 1 ? 'traveler' : 'travelers'}</span>
                                            </div>
                                            <div className="detail-row">
                                                <FaClock />
                                                <span>{booking.accommodation} accommodation</span>
                                            </div>
                                        </div>

                                        <div className="booking-options">
                                            {booking.flightNeeded && (
                                                <span className="option-badge flight">
                                                    <FaPlane /> Flights
                                                </span>
                                            )}
                                            {booking.insurance && (
                                                <span className="option-badge insurance">
                                                    <FaShieldAlt /> Insurance
                                                </span>
                                            )}
                                        </div>

                                        <div className="booking-footer">
                                            <div className="booking-price">
                                                <span className="currency">{booking.currency}</span>
                                                <span className="amount">{booking.totalPrice.toLocaleString()}</span>
                                            </div>

                                            {booking.status === 'confirmed' && (
                                                <button
                                                    className="btn ghost cancel-btn"
                                                    onClick={() => handleCancel(booking.bookingId)}
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
