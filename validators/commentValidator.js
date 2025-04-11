// validators/commentValidator.js
const Joi = require('joi');

module.exports = (data) => {
    const schema = Joi.object({
        contentItem: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
        authorName: Joi.string().required(),
        authorEmail: Joi.string().email().required(),
        authorUrl: Joi.string().uri().allow(''),
        authorIp: Joi.string().allow(''),
        content: Joi.string().required(),
        status: Joi.string().valid('pending', 'approved', 'spam').default('pending'),
        parent: Joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null)
    });

    return schema.validate(data);
};
