// services/genericService.js
// (You already have this, but I'll provide an extended version)
module.exports = (Model) => {
    return {
        create: async (data) => {
            return await new Model(data).save();
        },

        findAll: async (query = {}, options = {}) => {
            const { sort = { createdAt: -1 }, limit = 0, skip = 0, populate = [] } = options;
            return await Model.find(query)
                .sort(sort)
                .limit(Number(limit))
                .skip(Number(skip))
                .populate(populate);
        },

        findById: async (id, populate = []) => {
            return await Model.findById(id).populate(populate);
        },

        update: async (id, data) => {
            return await Model.findByIdAndUpdate(id, data, { new: true });
        },

        remove: async (id) => {
            return await Model.findByIdAndDelete(id);
        },

        count: async (query = {}) => {
            return await Model.countDocuments(query);
        }
    };
};

