// controllers/cmsController.js
// Extended controller with specific CMS functionality
module.exports = (service, validate) => {
    const genericController = require('./genericController')(service, validate);

    return {
        ...genericController,

        // Get content filtered by type
        getByType: async (req, res) => {
            try {
                const {typeName} = req.params;
                const {limit, skip, sort} = req.query;

                const options = {
                    limit,
                    skip,
                    sort: sort ? JSON.parse(sort) : {createdAt: -1},
                    populate: ['contentType', 'categories', 'tags']
                };

                const data = await service.findByContentType(typeName, options);
                res.json(data);
            } catch (err) {
                res.status(500).json({error: 'Fetch failed', details: err.message});
            }
        },

        // Get published content
        getPublished: async (req, res) => {
            try {
                const {limit, skip, sort} = req.query;
                let query = {};

                // Handle filtering
                if (req.query.category) {
                    query.categories = req.query.category;
                }

                if (req.query.tag) {
                    query.tags = req.query.tag;
                }

                const options = {
                    limit,
                    skip,
                    sort: sort ? JSON.parse(sort) : {publishedAt: -1},
                    populate: ['contentType', 'categories', 'tags', 'mediaRelations.media']
                };

                const data = await service.findPublished(query, options);
                res.json(data);
            } catch (err) {
                res.status(500).json({error: 'Fetch failed', details: err.message});
            }
        },

        // Add media to content
        addMedia: async (req, res) => {
            try {
                const {id} = req.params;
                const {mediaId, relationshipType, sortOrder} = req.body;

                const content = await service.findById(id);
                if (!content) return res.status(404).json({error: 'Content not found'});

                // Check if media relation already exists
                const existingRelation = content.mediaRelations.find(
                    rel => rel.media.toString() === mediaId && rel.relationshipType === relationshipType
                );

                if (existingRelation) {
                    existingRelation.sortOrder = sortOrder || existingRelation.sortOrder;
                } else {
                    content.mediaRelations.push({
                        media: mediaId,
                        relationshipType,
                        sortOrder: sortOrder || 0
                    });
                }

                await content.save();
                res.json(content);
            } catch (err) {
                res.status(500).json({error: 'Adding media failed', details: err.message});
            }
        },

        // Remove media from content
        removeMedia: async (req, res) => {
            try {
                const {id, mediaId} = req.params;
                const {relationshipType} = req.query;

                const content = await service.findById(id);
                if (!content) return res.status(404).json({error: 'Content not found'});

                content.mediaRelations = content.mediaRelations.filter(
                    rel => !(rel.media.toString() === mediaId &&
                        (!relationshipType || rel.relationshipType === relationshipType))
                );

                await content.save();
                res.json(content);
            } catch (err) {
                res.status(500).json({error: 'Removing media failed', details: err.message});
            }
        },

        // Update content settings
        updateSettings: async (req, res) => {
            try {
                const {id} = req.params;
                const settings = req.body;

                const content = await service.findById(id);
                if (!content) return res.status(404).json({error: 'Content not found'});

                // Update settings
                Object.keys(settings).forEach(key => {
                    content.settings.set(key, settings[key]);
                });

                await content.save();
                res.json(content);
            } catch (err) {
                res.status(500).json({error: 'Updating settings failed', details: err.message});
            }
        }
    };
};

