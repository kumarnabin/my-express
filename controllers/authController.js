const User = require('../models/userSchema');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');

/**
 * Login user and return tokens
 */
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate request
        if (!email || !password) {
            return next(createError(400, 'Email and password are required'));
        }

        // Find user by email
        const user = await User.findOne({ email });

        // Check if user exists
        if (!user) {
            return next(createError(401, 'Invalid credentials'));
        }

        // Check if user is active
        if (!user.isActive) {
            return next(createError(401, 'Account is deactivated'));
        }

        // Validate password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return next(createError(401, 'Invalid credentials'));
        }

        // Clean up expired refresh tokens
        await user.cleanupRefreshTokens();

        // Generate tokens
        const accessToken = user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        // Return tokens
        res.json({
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Refresh access token using refresh token
 */
exports.refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return next(createError(400, 'Refresh token is required'));
        }

        // Verify refresh token
        let decoded;
        try {
            decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        } catch (error) {
            return next(createError(401, 'Invalid refresh token'));
        }

        // Find user and check if refresh token exists
        const user = await User.findById(decoded.userId);

        if (!user) {
            return next(createError(401, 'User not found'));
        }

        if (!user.isActive) {
            return next(createError(401, 'Account is deactivated'));
        }

        // Check if refresh token is in user's refresh tokens collection
        const tokenExists = user.refreshTokens.some(rt => rt.token === refreshToken);
        if (!tokenExists) {
            return next(createError(401, 'Refresh token has been revoked'));
        }

        // Generate new access token
        const accessToken = user.generateAccessToken();

        res.json({ accessToken });
    } catch (error) {
        next(error);
    }
};

/**
 * Logout user by invalidating refresh token
 */
exports.logout = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return next(createError(400, 'Refresh token is required'));
        }

        // Verify refresh token
        let decoded;
        try {
            decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        } catch (error) {
            // If token is invalid or expired, just return success
            return res.json({ message: 'Logged out successfully' });
        }

        // Find user
        const user = await User.findById(decoded.userId);

        if (user) {
            // Remove the refresh token
            await user.removeRefreshToken(refreshToken);
        }

        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        next(error);
    }
};

/**
 * Get current user info
 */
exports.getCurrentUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId).select('-password -refreshTokens');

        if (!user) {
            return next(createError(404, 'User not found'));
        }

        res.json(user);
    } catch (error) {
        next(error);
    }
};