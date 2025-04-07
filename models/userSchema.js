const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    password: { type: String, required: true, minlength: 8 },
    phone: { type: String, trim: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    refreshTokens: [{ token: String, expiresAt: Date }],
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({ userId: this._id, role: this.role }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: process.env.JWT_ACCESS_LIFETIME || '15m',
    });
};

userSchema.methods.generateRefreshToken = async function () {
    const token = jwt.sign({ userId: this._id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_LIFETIME || '7d',
    });
    const decoded = jwt.decode(token);
    this.refreshTokens.push({ token, expiresAt: new Date(decoded.exp * 1000) });
    await this.save();
    return token;
};

userSchema.methods.cleanupRefreshTokens = async function () {
    const now = new Date();
    this.refreshTokens = this.refreshTokens.filter(rt => rt.expiresAt >= now);
    await this.save();
};

userSchema.methods.removeRefreshToken = async function (token) {
    this.refreshTokens = this.refreshTokens.filter(rt => rt.token !== token);
    await this.save();
};

const User = mongoose.models.User || mongoose.model('User', userSchema);
module.exports = User;
