// validators/contentItemValidator.js
const Joi = require('joi');

module.exports = (data) => {
    const schema = Joi.object({
        title: Joi.string().required().trim(),
        slug: Joi.string().trim().lowercase(),
        status: Joi.string().valid('draft', 'published', 'archived').default('draft'),
        author: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
        publishedAt: Joi.date(),
        contentType: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
        visibility: Joi.string().valid('public', 'private', 'password_protected').default('public'),
        sortOrder: Joi.number().default(0),
        content: Joi.string().allow(''),
        excerpt: Joi.string().allow(''),
        categories: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
        tags: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
        mediaRelations: Joi.array().items(
            Joi.object({
                media: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
                relationshipType: Joi.string().valid('featured', 'gallery', 'attachment'),
                sortOrder: Joi.number().default(0)
            })
        ),
        settings: Joi.object().pattern(
            Joi.string(),
            Joi.any()
        )
    });

    return schema.validate(data);
};

