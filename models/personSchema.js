const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
  full_name: {
    type: String,
    required: true
  },
  dob: {
    type: Date,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    required: true
  }
});

const Person = mongoose.model('Person', personSchema);

module.exports = Person;
