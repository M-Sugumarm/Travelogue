const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'travelogue-secret-key-2024';
const JWT_EXPIRES = '7d';

// Generate JWT token
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES }
    );
};

// Middleware to verify token
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// POST /api/auth/register - Register new user
router.post('/register', async (req, res) => {
    try {
        const { email, password, firstName, lastName, phone } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Create user
        const user = new User({
            email: email.toLowerCase(),
            password,
            firstName,
            lastName,
            phone: phone || ''
        });

        await user.save();

        // Generate token
        const token = generateToken(user);

        res.status(201).json({
            message: 'Registration successful',
            user: user.toPublicJSON(),
            token
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// POST /api/auth/login - Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate token
        const token = generateToken(user);

        res.json({
            message: 'Login successful',
            user: user.toPublicJSON(),
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// GET /api/auth/me - Get current user
router.get('/me', authMiddleware, async (req, res) => {
    res.json({ user: req.user.toPublicJSON() });
});

// PUT /api/auth/profile - Update profile
router.put('/profile', authMiddleware, async (req, res) => {
    try {
        const { firstName, lastName, phone } = req.body;

        req.user.firstName = firstName || req.user.firstName;
        req.user.lastName = lastName || req.user.lastName;
        req.user.phone = phone || req.user.phone;

        await req.user.save();

        res.json({
            message: 'Profile updated',
            user: req.user.toPublicJSON()
        });
    } catch (error) {
        res.status(500).json({ error: 'Update failed' });
    }
});

// POST /api/auth/favorites/:tripId - Toggle favorite
router.post('/favorites/:tripId', authMiddleware, async (req, res) => {
    try {
        const { tripId } = req.params;
        const index = req.user.favorites.indexOf(tripId);

        if (index > -1) {
            req.user.favorites.splice(index, 1);
        } else {
            req.user.favorites.push(tripId);
        }

        await req.user.save();

        res.json({
            favorites: req.user.favorites
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update favorites' });
    }
});

module.exports = { router, authMiddleware };
