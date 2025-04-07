/**
 * Database seeder system
 *
 * Usage:
 * - To seed all collections: node seeder.js --import
 * - To seed specific collection: node seeder.js --import --collection=users
 * - To delete all data: node seeder.js --delete
 * - To delete specific collection: node seeder.js --delete --collection=users
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/UserSchema');
// Import other models as needed
// const Product = require('../models/Product');
// const Category = require('../models/Category');

// MongoDB connection
const mongoUrl = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/my_express';

// Sample users data
const userData = [
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

// Add sample data for other collections as needed
// const productData = [...];
// const categoryData = [...];

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(mongoUrl);
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

// Seed the users collection
const seedUsers = async () => {
    try {
        await User.deleteMany();
        console.log('🧹 Cleared users collection');

        await User.create(userData);
        console.log(`✅ Seeded ${userData.length} users`);

        return true;
    } catch (error) {
        console.error('❌ Error seeding users:', error);
        return false;
    }
};

// Add additional seeder functions for other collections
// const seedProducts = async () => {...};
// const seedCategories = async () => {...};

// Import all data to DB
const importData = async (collection = null) => {
    try {
        await connectDB();

        if (!collection || collection === 'users') {
            await seedUsers();
        }

        // Add other collection seeders as needed
        // if (!collection || collection === 'products') {
        //   await seedProducts();
        // }
        // if (!collection || collection === 'categories') {
        //   await seedCategories();
        // }

        console.log('✅ Data import complete');
        process.exit();
    } catch (error) {
        console.error('❌ Error importing data:', error);
        process.exit(1);
    }
};

// Delete all data from DB
const deleteData = async (collection = null) => {
    try {
        await connectDB();

        if (!collection || collection === 'users') {
            await User.deleteMany();
            console.log('🧹 Deleted all users');
        }

        // Add other collection deletions as needed
        // if (!collection || collection === 'products') {
        //   await Product.deleteMany();
        //   console.log('🧹 Deleted all products');
        // }
        // if (!collection || collection === 'categories') {
        //   await Category.deleteMany();
        //   console.log('🧹 Deleted all categories');
        // }

        console.log('✅ Data deletion complete');
        process.exit();
    } catch (error) {
        console.error('❌ Error deleting data:', error);
        process.exit(1);
    }
};

// Command line processing
const processArgs = () => {
    const args = process.argv.slice(2);

    // Get collection parameter if specified
    const collectionArg = args.find(arg => arg.startsWith('--collection='));
    const collection = collectionArg ? collectionArg.split('=')[1] : null;

    if (args.includes('--import')) {
        importData(collection);
    } else if (args.includes('--delete')) {
        deleteData(collection);
    } else {
        console.log(`
Usage:
  - Import all data: node seeder.js --import
  - Import specific collection: node seeder.js --import --collection=users
  - Delete all data: node seeder.js --delete
  - Delete specific collection: node seeder.js --delete --collection=users
    `);
        process.exit();
    }
};

// Run the seeder
processArgs();