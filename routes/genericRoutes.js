// routes/personRoutes.js
const express = require('express');
const User = require('../models/UserSchema');
const Person = require('../models/personSchema');
const userValidator = require('../validators/userValidator'); // Joi or any lib
const personValidator = require('../validators/personValidator'); // Joi or any lib
const createGenericService = require('../services/genericService');
const createGenericController = require('../controllers/genericController');
const {authenticateToken} = require("../middlewares/authenticateToken");
const router = express.Router();
const userController = createGenericController(createGenericService(User), userValidator);
const personController = createGenericController(createGenericService(Person), personValidator);

const routes = [
    {route: 'users', controller: userController},
    {route: 'persons', controller: personController}
];

routes.forEach((item) => {
    router.post(`/${item.route}/`, authenticateToken, item.controller.create);
    router.get(`/${item.route}/`, authenticateToken, item.controller.getAll);
    router.get(`/${item.route}/:id`, authenticateToken, item.controller.getById);
    router.put(`/${item.route}/:id`, authenticateToken, item.controller.update);
    router.delete(`/${item.route}/:id`, authenticateToken, item.controller.remove);
});

module.exports = router;