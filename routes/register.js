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

router.post('/login', function(req, res, next) {
  // Get Form Values
  console.log("Logining");
  console.log(req.body);
  validateEmailAccessibility(req.body.loginemail,req.body.loginpassword).then(function(msg) {
    if (msg=="Login Successful") {
      console.log("Login Successful");
    }
    else if(msg=="Wrong Password")
    {
      console.log("Wrong Password,Try again!")
    }
    else {
      console.log("Email does not exists");
    }
  });
  // req.flash('success', 'User Registered Successfully!Login to continue!');
  return res.send(req.body);
});

function validateEmailAccessibility(loginemail,loginpassword){

  return User.findOne({email: loginemail}).then(function(result){
      
      console.log(result);
      
      if(result)
      {
        if(result.password==loginpassword)
        {
          return "Login Successful";
        }
        else
        {
          return "Wrong Password";
        }
      }
      else
      {
          return "Email doesn't exist";
      }
      
  });
}


exports.routes = router;
exports.users=users;
