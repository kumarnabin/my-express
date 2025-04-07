// seeder.js
const mongoose = require('mongoose');
const Person = require('../models/personSchema');

mongoose.connect('mongodb://localhost:27017/my_express');

const seedData = [
    {
        full_name: 'John Doe',
        dob: new Date('1990-01-01'),
        phone: '1234567890',
        photo: 'https://via.placeholder.com/150',
    },
    {
        full_name: 'Jane Smith',
        dob: new Date('1985-05-10'),
        phone: '0987654321',
        photo: 'https://via.placeholder.com/150',
    },
];

const seedDB = async () => {
    try {
        await Person.deleteMany({});
        await Person.insertMany(seedData);
        console.log('Database seeded!');
    } catch (err) {
        console.error('Seeding error:', err);
    } finally {
        mongoose.connection.close();
    }
};

seedDB();
