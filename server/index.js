require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import routes
const tripRoutes = require('./routes/trips');
const bookingRoutes = require('./routes/bookings');
const reviewRoutes = require('./routes/reviews');
const { router: authRoutes } = require('./routes/auth');
const paymentRoutes = require('./routes/payments');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
    credentials: true
}));
app.use(express.json());

// Request logging (dev)
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} | ${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payments', paymentRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        message: 'Travelogue API is running 🚀'
    });
});

// Root route
app.get('/', (req, res) => {
    res.json({
        name: 'Travelogue API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            trips: '/api/trips',
            bookings: '/api/bookings',
            reviews: '/api/reviews',
            health: '/api/health'
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════╗
║      🌍 Travelogue API Server                     ║
╠══════════════════════════════════════════════════╣
║  Server:   http://localhost:${PORT}                  ║
║  API:      http://localhost:${PORT}/api              ║
║  Auth:     http://localhost:${PORT}/api/auth         ║
╚══════════════════════════════════════════════════╝
  `);
});
