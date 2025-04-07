// services/genericService.js
module.exports = (Model) => ({
    create: (data) => Model.create(data),
    findAll: () => Model.find({}),
    findById: (id) => Model.findById(id),
    update: (id, data) => Model.findByIdAndUpdate(id, data, { new: true }),
    remove: (id) => Model.findByIdAndDelete(id),
});
