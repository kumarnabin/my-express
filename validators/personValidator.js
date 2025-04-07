const Joi = require('joi');

const personSchema = Joi.object({
    full_name: Joi.string().required(),
    dob: Joi.date().required(),
    phone: Joi.string().required(),
    photo: Joi.string().required(),
});

module.exports = (data) => personSchema.validate(data);
