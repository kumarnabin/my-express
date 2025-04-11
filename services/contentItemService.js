// services/contentItemService.js
// Extended service for content items with specific methods
module.exports = (ContentItem, ContentType) => {
    const genericService = require('./genericService')(ContentItem);

    return {
        ...genericService,

        // Find content by type name
        findByContentType: async (typeName, options = {}) => {
            const contentType = await ContentType.findOne({ name: typeName });
            if (!contentType) return [];

            const query = { contentType: contentType._id };
            const { sort = { createdAt: -1 }, limit = 0, skip = 0, populate = [] } = options;

            return await ContentItem.find(query)
                .sort(sort)
                .limit(Number(limit))
                .skip(Number(skip))
                .populate(populate);
        },

        // Find published content
        findPublished: async (query = {}, options = {}) => {
            const publishedQuery = {
                ...query,
                status: 'published',
                visibility: 'public',
                publishedAt: { $lte: new Date() }
            };

            return await genericService.findAll(publishedQuery, options);
        },

        // Find content with specific settings
        findWithSetting: async (key, value, options = {}) => {
            // This is a bit tricky with MongoDB's Map type, using aggregation
            return await ContentItem.aggregate([
                { $match: { [`settings.${key}`]: value } },
                { $sort: options.sort || { createdAt: -1 } },
                { $skip: Number(options.skip) || 0 },
                { $limit: Number(options.limit) || 0 }
            ]);
        }
    };
};
