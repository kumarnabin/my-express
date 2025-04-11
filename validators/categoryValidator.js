// validators/categoryValidator.js
const Joi = require('joi');

module.exports = (data) => {
    const schema = Joi.object({
        name: Joi.string().required().trim(),
        slug: Joi.string().required().trim().lowercase(),
        description: Joi.string().allow(''),
        parent: Joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null)
    });

    return schema.validate(data);
};
