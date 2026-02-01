import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaImage, FaSpinner } from 'react-icons/fa'

const ADMIN_EMAIL = 'sugus7215@gmail.com'
const API_BASE = 'http://localhost:5000/api'

export default function AdminPanel() {
    const { user, isLoaded } = useUser()
    const [trips, setTrips] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingTrip, setEditingTrip] = useState(null)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })

    const isAdmin = user?.primaryEmailAddress?.emailAddress?.toLowerCase() === ADMIN_EMAIL.toLowerCase()
    const adminEmail = user?.primaryEmailAddress?.emailAddress || ''

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        location: '',
        price: '',
        duration: '',
        image: '',
        summary: '',
        description: '',
        tags: '',
        rating: 4.5,
        featured: false,
        maxGroupSize: 20,
        highlights: '',
        inclusions: '',
        exclusions: ''
    })

    useEffect(() => {
        if (isLoaded && isAdmin) {
            loadTrips()
        }
    }, [isLoaded, isAdmin])

    const loadTrips = async () => {
        try {
            setLoading(true)
            const res = await fetch(`${API_BASE}/trips`)
            const data = await res.json()
            setTrips(data.data || [])
        } catch (error) {
            showMessage('error', 'Failed to load trips')
        } finally {
            setLoading(false)
        }
    }

    const showMessage = (type, text) => {
        setMessage({ type, text })
        setTimeout(() => setMessage({ type: '', text: '' }), 4000)
    }

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const resetForm = () => {
        setFormData({
            title: '',
            location: '',
            price: '',
            duration: '',
            image: '',
            summary: '',
            description: '',
            tags: '',
            rating: 4.5,
            featured: false,
            maxGroupSize: 20,
            highlights: '',
            inclusions: '',
            exclusions: ''
        })
        setEditingTrip(null)
        setShowForm(false)
    }

    const handleEdit = (trip) => {
        setFormData({
            title: trip.title || '',
            location: trip.location || '',
            price: trip.price || '',
            duration: trip.duration || '',
            image: trip.image || '',
            summary: trip.summary || '',
            description: trip.description || '',
            tags: Array.isArray(trip.tags) ? trip.tags.join(', ') : '',
            rating: trip.rating || 4.5,
            featured: trip.featured || false,
            maxGroupSize: trip.maxGroupSize || trip.groupSize?.max || 20,
            highlights: Array.isArray(trip.highlights) ? trip.highlights.join('\n') : '',
            inclusions: Array.isArray(trip.inclusions) ? trip.inclusions.join('\n') : (Array.isArray(trip.included) ? trip.included.join('\n') : ''),
            exclusions: Array.isArray(trip.exclusions) ? trip.exclusions.join('\n') : (Array.isArray(trip.notIncluded) ? trip.notIncluded.join('\n') : '')
        })
        setEditingTrip(trip)
        setShowForm(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)

        try {
            const tripPayload = {
                ...formData,
                price: Number(formData.price),
                budget: `$${formData.price}`, // Required by schema
                rating: Number(formData.rating),
                tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
                highlights: formData.highlights.split('\n').map(h => h.trim()).filter(Boolean),
                included: formData.inclusions.split('\n').map(i => i.trim()).filter(Boolean), // Schema expects 'included'
                notIncluded: formData.exclusions.split('\n').map(e => e.trim()).filter(Boolean), // Schema expects 'notIncluded'
                groupSize: {
                    min: 1,
                    max: Number(formData.maxGroupSize) // Schema expects groupSize object
                },
                // Legacy fields for compatibility if needed
                maxSpots: Number(formData.maxGroupSize),
                spotsAvailable: Number(formData.maxGroupSize)
            }

            const url = editingTrip
                ? `${API_BASE}/trips/${editingTrip.tripId}`
                : `${API_BASE}/trips`

            const method = editingTrip ? 'PUT' : 'POST'

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-Admin-Email': adminEmail
                },
                body: JSON.stringify(tripPayload)
            })

            const data = await res.json()

            if (data.success) {
                showMessage('success', editingTrip ? 'Trip updated!' : 'Trip created!')
                resetForm()
                loadTrips()
            } else {
                showMessage('error', data.error || 'Operation failed')
            }
        } catch (error) {
            showMessage('error', 'Failed to save trip')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (tripId) => {
        if (!confirm('Are you sure you want to delete this trip?')) return

        try {
            const res = await fetch(`${API_BASE}/trips/${tripId}`, {
                method: 'DELETE',
                headers: {
                    'X-Admin-Email': adminEmail
                }
            })

            const data = await res.json()

            if (data.success) {
                showMessage('success', 'Trip deleted!')
                loadTrips()
            } else {
                showMessage('error', data.error || 'Delete failed')
            }
        } catch (error) {
            showMessage('error', 'Failed to delete trip')
        }
    }

    // Not loaded yet
    if (!isLoaded) {
        return (
            <div className="admin-panel">
                <div className="admin-loading">
                    <FaSpinner className="spinner" />
                    <p>Loading...</p>
                </div>
            </div>
        )
    }

    // Not signed in
    if (!user) {
        return (
            <div className="admin-panel">
                <div className="admin-unauthorized">
                    <h1>🔒 Admin Access Required</h1>
                    <p>Please sign in to access the admin panel.</p>
                </div>
            </div>
        )
    }

    // Not admin
    if (!isAdmin) {
        return (
            <div className="admin-panel">
                <div className="admin-unauthorized">
                    <h1>⛔ Access Denied</h1>
                    <p>You don't have admin privileges.</p>
                    <small>Logged in as: {user.primaryEmailAddress?.emailAddress}</small>
                </div>
            </div>
        )
    }

    return (
        <div className="admin-panel">
            <div className="admin-container">
                <header className="admin-header">
                    <div>
                        <h1>🎛️ Admin Panel</h1>
                        <p>Manage your travel destinations</p>
                    </div>
                    <button className="btn-primary" onClick={() => setShowForm(true)}>
                        <FaPlus /> Add New Trip
                    </button>
                </header>

                {message.text && (
                    <div className={`admin-message ${message.type}`}>
                        {message.text}
                    </div>
                )}

                {/* Trip Form Modal */}
                {showForm && (
                    <div className="admin-modal-overlay" onClick={() => resetForm()}>
                        <div className="admin-modal" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>{editingTrip ? 'Edit Trip' : 'Add New Trip'}</h2>
                                <button className="close-btn" onClick={resetForm}>
                                    <FaTimes />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="trip-form">
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Title *</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="e.g., Bali Paradise Escape"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Location *</label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="e.g., Bali, Indonesia"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Price ($) *</label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            required
                                            min="0"
                                            placeholder="1299"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Duration *</label>
                                        <input
                                            type="text"
                                            name="duration"
                                            value={formData.duration}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="e.g., 7 days"
                                        />
                                    </div>

                                    <div className="form-group full-width">
                                        <label>Image URL *</label>
                                        <div className="image-input">
                                            <input
                                                type="url"
                                                name="image"
                                                value={formData.image}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="https://example.com/image.jpg"
                                            />
                                            {formData.image && (
                                                <img src={formData.image} alt="Preview" className="image-preview" />
                                            )}
                                        </div>
                                    </div>

                                    <div className="form-group full-width">
                                        <label>Summary *</label>
                                        <textarea
                                            name="summary"
                                            value={formData.summary}
                                            onChange={handleInputChange}
                                            required
                                            rows={2}
                                            placeholder="Brief description for cards..."
                                        />
                                    </div>

                                    <div className="form-group full-width">
                                        <label>Full Description</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows={4}
                                            placeholder="Detailed trip description..."
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Tags (comma separated)</label>
                                        <input
                                            type="text"
                                            name="tags"
                                            value={formData.tags}
                                            onChange={handleInputChange}
                                            placeholder="Beach, Adventure, Culture"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Rating</label>
                                        <input
                                            type="number"
                                            name="rating"
                                            value={formData.rating}
                                            onChange={handleInputChange}
                                            min="0"
                                            max="5"
                                            step="0.1"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Max Group Size</label>
                                        <input
                                            type="number"
                                            name="maxGroupSize"
                                            value={formData.maxGroupSize}
                                            onChange={handleInputChange}
                                            min="1"
                                        />
                                    </div>

                                    <div className="form-group checkbox-group">
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="featured"
                                                checked={formData.featured}
                                                onChange={handleInputChange}
                                            />
                                            Featured Trip
                                        </label>
                                    </div>

                                    <div className="form-group full-width">
                                        <label>Highlights (one per line)</label>
                                        <textarea
                                            name="highlights"
                                            value={formData.highlights}
                                            onChange={handleInputChange}
                                            rows={3}
                                            placeholder="Visit ancient temples&#10;Snorkeling adventure&#10;Traditional cooking class"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Inclusions (one per line)</label>
                                        <textarea
                                            name="inclusions"
                                            value={formData.inclusions}
                                            onChange={handleInputChange}
                                            rows={3}
                                            placeholder="Hotel accommodation&#10;Daily breakfast&#10;Airport transfers"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Exclusions (one per line)</label>
                                        <textarea
                                            name="exclusions"
                                            value={formData.exclusions}
                                            onChange={handleInputChange}
                                            rows={3}
                                            placeholder="International flights&#10;Travel insurance&#10;Personal expenses"
                                        />
                                    </div>
                                </div>

                                <div className="form-actions">
                                    <button type="button" className="btn-secondary" onClick={resetForm}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn-primary" disabled={saving}>
                                        {saving ? <><FaSpinner className="spinner" /> Saving...</> : <><FaSave /> Save Trip</>}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Trips List */}
                <div className="admin-trips-list">
                    {loading ? (
                        <div className="admin-loading">
                            <FaSpinner className="spinner" />
                            <p>Loading trips...</p>
                        </div>
                    ) : trips.length === 0 ? (
                        <div className="admin-empty">
                            <p>No trips found. Create your first trip!</p>
                        </div>
                    ) : (
                        <div className="trips-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Image</th>
                                        <th>Title</th>
                                        <th>Location</th>
                                        <th>Price</th>
                                        <th>Duration</th>
                                        <th>Featured</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {trips.map(trip => (
                                        <tr key={trip.tripId || trip._id}>
                                            <td>
                                                <img
                                                    src={trip.image}
                                                    alt={trip.title}
                                                    className="trip-thumb"
                                                    onError={(e) => e.target.src = 'https://via.placeholder.com/60x40?text=No+Image'}
                                                />
                                            </td>
                                            <td className="title-cell">{trip.title}</td>
                                            <td>{trip.location}</td>
                                            <td className="price-cell">${trip.price}</td>
                                            <td>{trip.duration}</td>
                                            <td>{trip.featured ? '⭐' : '-'}</td>
                                            <td className="actions-cell">
                                                <button
                                                    className="action-btn edit"
                                                    onClick={() => handleEdit(trip)}
                                                    title="Edit"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    className="action-btn delete"
                                                    onClick={() => handleDelete(trip.tripId)}
                                                    title="Delete"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
