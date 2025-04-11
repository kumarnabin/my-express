/**
 * User database seeder
 *
 * This script creates sample users in the database with proper password hashing
 * Run with: node userSeeder.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/userSchema');
const bcrypt = require('bcrypt');

// MongoDB connection
const mongoUrl = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/my_express';

// Sample users to seed
const users = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'Password123!',
        phone: '1234567890',
        role: 'admin',
        isActive: true
    },
    {
        name: 'Regular User',
        email: 'user@example.com',
        password: 'Password123!',
        phone: '9876543210',
        role: 'user',
        isActive: true
    },
    {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
        phone: '5555555555',
        role: 'user',
        isActive: true
    },
    {
        name: 'Inactive User',
        email: 'inactive@example.com',
        password: 'Password123!',
        phone: '1112223333',
        role: 'user',
        isActive: false
    }
];

/**
 * Seed the database with users
 */
async function seedUsers() {
    try {
        // Connect to MongoDB
        await mongoose.connect(mongoUrl);
        console.log('✅ Connected to MongoDB');

        // Clear existing users
        await User.deleteMany({});
        console.log('🧹 Cleared existing users');

        // Create new users
        const createdUsers = [];

        for (const userData of users) {
            // We don't need to hash passwords manually as our User model
            // has a pre-save hook for password hashing
            const user = new User(userData);
            await user.save();
            createdUsers.push(user);
        }

        console.log(`✅ Successfully seeded ${createdUsers.length} users`);
        console.log('📝 User login credentials:');
        users.forEach(user => {
            console.log(`   - ${user.email} / ${user.password} (${user.role})`);
        });

    } catch (error) {
        console.error('❌ Error seeding users:', error);
    } finally {
        // Close the MongoDB connection
        await mongoose.disconnect();
        console.log('📴 Disconnected from MongoDB');
    }
}

// Run the seeder
seedUsers();