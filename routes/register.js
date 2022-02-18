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
  return res.send(req.body);
  // res.redirect(301,'/exercise/bicepcurl');
  // try{
  //   console.log("In flash");
  //   req.flash('success', 'This is a flash message using the express-flash module.');
  // }
  // catch(err){
  //   console.log("Error in flash");
  //   console.log(err);
  // }
  // try{
  //   console.log("In redirect");
  //   res.redirect(301,'/');
  // }
  // catch(err){
  //   console.log("Error in redirect");
  //   console.log(err);
  // }

 
});
exports.routes = router;
exports.users=users;
