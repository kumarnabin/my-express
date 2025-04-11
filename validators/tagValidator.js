// validators/tagValidator.js
const Joi = require('joi');

module.exports = (data) => {
    const schema = Joi.object({
        name: Joi.string().required().trim(),
        slug: Joi.string().required().trim().lowercase()
    });

    return schema.validate(data);
};
