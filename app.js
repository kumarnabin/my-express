// Load environment variables
require('dotenv').config();

// Import dependencies
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

// Import route handlers
const indexRouter = require('./routes/index');
const genericRouter = require('./routes/genericRoutes');
const authenticateToken = require('./middlewares/authenticateToken');

// Initialize Express app
const app = express();

// Database connection
const mongoUrl = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/my_express';
mongoose.connect(mongoUrl)
    .then(() => console.log('✅ MongoDB connection successful'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Security middleware
app.use(helmet());
// Get CORS origins from environment variable and convert to array
const corsOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000').split(',').map(origin => origin.trim());

// Apply a single CORS middleware with the array of allowed origins
app.use(cors({
    origin: corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// API rate limiting
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false
});
app.use('/api', apiLimiter);

// Request processing middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);
app.use('/crud', genericRouter); // Apply auth middleware before the route handler

// Error handling
// 404 handler
app.use(function (req, res, next) {
    next(createError(404));
});

// Global error handler
app.use(function (err, req, res, next) {
    // Set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // Render the error page
    res.status(err.status || 500);
    res.render('error');
});

// Start server if this file is run directly
if (require.main === module) {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`✅ Server running on http://localhost:${port}`);
    });
}

module.exports = app;