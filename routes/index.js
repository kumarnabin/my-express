require("dotenv").config(); // environment variable

// require packages
const mongoose = require("mongoose");


var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express Framework' });
});

module.exports = router;
