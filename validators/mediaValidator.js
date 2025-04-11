// validators/mediaValidator.js
const Joi = require('joi');

module.exports = (data) => {
    const schema = Joi.object({
        fileName: Joi.string().required(),
        filePath: Joi.string().required(),
        fileType: Joi.string().valid('image', 'video', 'document', 'audio', 'other').required(),
        mimeType: Joi.string().required(),
        fileSize: Joi.number().required(),
        altText: Joi.string().allow(''),
        title: Joi.string().allow(''),
        description: Joi.string().allow(''),
        uploadedBy: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
    });

    return schema.validate(data);
};
