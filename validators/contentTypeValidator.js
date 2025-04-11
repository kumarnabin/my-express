// validators/contentTypeValidator.js
const Joi = require('joi');

module.exports = (data) => {
    const schema = Joi.object({
        name: Joi.string().required().trim(),
        description: Joi.string().allow(''),
        defaultTemplate: Joi.string().default('default'),
        supportsComments: Joi.boolean().default(true),
        supportsSticky: Joi.boolean().default(false)
    });

    return schema.validate(data);
};
