import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getBookings } from '../services/api';

const AppContext = createContext();

export function AppProvider({ children }) {
    // User info (email-based for demo)
    const [userEmail, setUserEmail] = useState(() => {
        return localStorage.getItem('userEmail') || '';
    });

    // Favorites/Wishlist
    const [favorites, setFavorites] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('favorites') || '[]');
        } catch {
            return [];
        }
    });

    // User bookings
    const [bookings, setBookings] = useState([]);
    const [bookingsLoading, setBookingsLoading] = useState(false);

    // Toast notifications
    const [toasts, setToasts] = useState([]);

    // Save email to localStorage
    useEffect(() => {
        if (userEmail) {
            localStorage.setItem('userEmail', userEmail);
        }
    }, [userEmail]);

    // Save favorites to localStorage
    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites]);

    // Toggle favorite
    const toggleFavorite = useCallback((tripId) => {
        setFavorites(prev => {
            const exists = prev.includes(tripId);
            return exists ? prev.filter(id => id !== tripId) : [...prev, tripId];
        });
    }, []);

    // Check if trip is favorite
    const isFavorite = useCallback((tripId) => {
        return favorites.includes(tripId);
    }, [favorites]);

    // Fetch user bookings
    const fetchBookings = useCallback(async () => {
        if (!userEmail) return;

        setBookingsLoading(true);
        try {
            const response = await getBookings(userEmail);
            setBookings(response.data || []);
        } catch (error) {
            console.error('Failed to fetch bookings:', error);
        } finally {
            setBookingsLoading(false);
        }
    }, [userEmail]);

    // Add new booking to local state
    const addBooking = useCallback((booking) => {
        setBookings(prev => [booking, ...prev]);
    }, []);

    // Show toast notification
    const showToast = useCallback((message, type = 'success', duration = 4000) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, duration);
    }, []);

    // Remove specific toast
    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const value = {
        // User
        userEmail,
        setUserEmail,

        // Favorites
        favorites,
        toggleFavorite,
        isFavorite,

        // Bookings
        bookings,
        bookingsLoading,
        fetchBookings,
        addBooking,

        // Toasts
        toasts,
        showToast,
        removeToast,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within AppProvider');
    }
    return context;
}

export default AppContext;
