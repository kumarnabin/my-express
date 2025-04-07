const Joi = require('joi');

const userSchema = Joi.object({
    name: Joi.string().required(),
    age: Joi.number().required(),
    email: Joi.string().required(),
});

module.exports = (data) => userSchema.validate(data);
