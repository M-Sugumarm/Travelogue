const API_BASE = 'http://localhost:5000/api';

// Get auth token from localStorage
function getAuthHeader() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
}

// Helper for fetch with error handling
async function fetchAPI(endpoint, options = {}) {
    try {
        const url = `${API_BASE}${endpoint}`;
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader(),
                ...options.headers,
            },
            ...options,
        });

        const data = await response.json();

        if (!response.ok) {
            const error = new Error(data.error || 'API request failed');
            error.response = { data, status: response.status };
            throw error;
        }

        return { data, status: response.status };
    } catch (error) {
        console.error(`API Error [${endpoint}]:`, error);
        throw error;
    }
}

// ============ AUTH API ============

export const authAPI = {
    register: (userData) => fetchAPI('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
    }),

    login: (email, password) => fetchAPI('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    }),

    getProfile: () => fetchAPI('/auth/me'),

    updateProfile: (data) => fetchAPI('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
    }),

    toggleFavorite: (tripId) => fetchAPI(`/auth/favorites/${tripId}`, {
        method: 'POST',
    }),
};

// ============ TRIPS API ============

export async function getTrips(params = {}) {
    const searchParams = new URLSearchParams();

    if (params.search) searchParams.set('search', params.search);
    if (params.tags) searchParams.set('tags', params.tags);
    if (params.minPrice) searchParams.set('minPrice', params.minPrice);
    if (params.maxPrice) searchParams.set('maxPrice', params.maxPrice);
    if (params.duration) searchParams.set('duration', params.duration);
    if (params.sort) searchParams.set('sort', params.sort);
    if (params.limit) searchParams.set('limit', params.limit);

    const query = searchParams.toString();
    const endpoint = query ? `/trips?${query}` : '/trips';

    return fetchAPI(endpoint);
}

export async function getTripById(tripId) {
    return fetchAPI(`/trips/${tripId}`);
}

export async function getFeaturedTrips() {
    return fetchAPI('/trips/featured');
}

export async function getPopularTrips() {
    return fetchAPI('/trips/popular');
}

export async function getSimilarTrips(tripId) {
    return fetchAPI(`/trips/${tripId}/similar`);
}

export async function getAllTags() {
    return fetchAPI('/trips/tags');
}

// ============ BOOKINGS API ============

export async function createBooking(bookingData) {
    return fetchAPI('/bookings', {
        method: 'POST',
        body: JSON.stringify(bookingData),
    });
}

export async function getBookings(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.email) searchParams.set('email', params.email);
    if (params.userId) searchParams.set('userId', params.userId);

    const query = searchParams.toString();
    return fetchAPI(`/bookings${query ? `?${query}` : ''}`);
}

export async function getBookingById(bookingId) {
    return fetchAPI(`/bookings/${bookingId}`);
}

export async function cancelBooking(bookingId) {
    return fetchAPI(`/bookings/${bookingId}/cancel`, {
        method: 'PATCH',
    });
}

// ============ REVIEWS API ============

export async function createReview(reviewData) {
    return fetchAPI('/reviews', {
        method: 'POST',
        body: JSON.stringify(reviewData),
    });
}

export async function getTripReviews(tripId, params = {}) {
    const searchParams = new URLSearchParams();
    if (params.sort) searchParams.set('sort', params.sort);
    if (params.limit) searchParams.set('limit', params.limit);

    const query = searchParams.toString();
    const endpoint = query ? `/reviews/${tripId}?${query}` : `/reviews/${tripId}`;

    return fetchAPI(endpoint);
}

export async function getRecentReviews(limit = 6) {
    return fetchAPI(`/reviews?limit=${limit}`);
}

export async function markReviewHelpful(reviewId) {
    return fetchAPI(`/reviews/${reviewId}/helpful`, {
        method: 'POST',
    });
}

// ============ HEALTH CHECK ============

export async function checkHealth() {
    return fetchAPI('/health');
}

// Export all as default object
export default {
    auth: authAPI,
    trips: {
        getAll: getTrips,
        getById: getTripById,
        getFeatured: getFeaturedTrips,
        getPopular: getPopularTrips,
        getSimilar: getSimilarTrips,
        getTags: getAllTags,
    },
    bookings: {
        create: createBooking,
        getAll: getBookings,
        getById: getBookingById,
        cancel: cancelBooking,
    },
    reviews: {
        create: createReview,
        getByTrip: getTripReviews,
        getRecent: getRecentReviews,
        markHelpful: markReviewHelpful,
    },
    health: checkHealth,
};
