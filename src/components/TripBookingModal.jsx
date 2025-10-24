import React, { useState } from 'react';
import { FaTimes, FaCalendarAlt, FaUsers, FaPlane, FaCreditCard } from 'react-icons/fa';
import logo from '../assets/logo.svg';

const TripBookingModal = ({ trip, onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    startDate: '',
    travelers: 1,
    flightNeeded: false,
    name: '',
    email: '',
    phone: ''
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Here you would typically handle the booking submission
      alert('Booking successful! Check your email for confirmation.');
      onClose();
    }
  };

  const calculateTotal = () => {
    const basePrice = parseInt(trip.budget.replace(/[^0-9]/g, ''));
    const flightCost = formData.flightNeeded ? basePrice * 0.4 : 0;
    return (basePrice + flightCost) * formData.travelers;
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="booking-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          <FaTimes />
        </button>
        
        <div className="booking-header">
          <div style={{display:'flex', alignItems:'center', gap:12}}>
            <img src={logo} alt="Travelogue" style={{height:36, borderRadius:8}} />
            <div>
              <h2 style={{margin:0}}>Book Your Adventure</h2>
              <h3 style={{margin:0}}>{trip.title}</h3>
            </div>
          </div>
        </div>

        <div className="booking-progress">
          <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>1. Trip Details</div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>2. Personal Info</div>
          <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>3. Payment</div>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="booking-step">
              <div className="form-group">
                <label>
                  <FaCalendarAlt />
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="form-group">
                <label>
                  <FaUsers />
                  Number of Travelers
                </label>
                <select
                  name="travelers"
                  value={formData.travelers}
                  onChange={handleInputChange}
                  required
                >
                  {[1,2,3,4,5,6].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'person' : 'people'}</option>
                  ))}
                </select>
              </div>

              <div className="form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    name="flightNeeded"
                    checked={formData.flightNeeded}
                    onChange={handleInputChange}
                  />
                  <FaPlane /> Include flights?
                </label>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="booking-step">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="booking-step">
              <div className="payment-summary">
                <h4>Trip Summary</h4>
                <div className="summary-item">
                  <span>Base Price</span>
                  <span>{trip.budget} × {formData.travelers}</span>
                </div>
                {formData.flightNeeded && (
                  <div className="summary-item">
                    <span>Flight Cost</span>
                    <span>+40% per person</span>
                  </div>
                )}
                <div className="summary-total">
                  <span>Total</span>
                  <span>{calculateTotal().toLocaleString()} {trip.budget.charAt(0)}</span>
                </div>
              </div>

              <div className="form-group">
                <label>
                  <FaCreditCard />
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="**** **** **** ****"
                  required
                />
              </div>

              <div className="card-details">
                <div className="form-group">
                  <label>Expiry</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>CVC</label>
                  <input
                    type="text"
                    placeholder="123"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          <div className="booking-actions">
            {step > 1 && (
              <button
                type="button"
                className="btn ghost"
                onClick={() => setStep(step - 1)}
              >
                Back
              </button>
            )}
            <button type="submit" className="btn book-now">
              {step === 3 ? 'Confirm Booking' : 'Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TripBookingModal;