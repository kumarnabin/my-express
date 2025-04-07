const jwt = require('jsonwebtoken');
const createError = require('http-errors');

/**
 * Middleware to authenticate token
 */
const authenticateToken = (req, res, next) => {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN format

    if (!token) {
        return next(createError(401, 'Access token is required'));
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        // Add user info to request
        req.user = {
            userId: decoded.userId,
            role: decoded.role
        };

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return next(createError(401, 'Access token expired'));
        }
        return next(createError(403, 'Invalid token'));
    }
};

/**
 * Middleware to check if user has admin role
 */
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    return next(createError(403, 'Requires admin privileges'));
};

module.exports = {
    authenticateToken,
    isAdmin
};