const path = require("path");
var User = require('../models/users')
const express = require('express');

const router = express.Router();
const users=[];

router.post('/register', function(req, res, next) {
  // Get Form Values
  console.log("Registering");
  console.log(req.body);
  new User(req.body).save();
  req.flash('success', 'User Registered Successfully!Login to continue!');
  return res.send(req.body);
});




exports.routes = router;
exports.users=users;
