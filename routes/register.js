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

router.post('/login',async function(req, res, next) {
  // Get Form Values
  console.log("Logining");
  console.log(req.body);
  
  var flag=await validateEmailAccessibility(req.body.loginemail,req.body.loginpassword).then(function(msg) {
    var res;
    if (msg=="Login Successful") {
      console.log("Login Successful");
      res=1;
    }
    else if(msg=="Wrong Password")
    {
      console.log("Wrong Password,Try again!");
      res=0;
      
    }
    else {
      console.log("Email does not exists");
      res=-1;
    }
    return res;
  });
  console.log(flag);
  if(flag==1)
  {
    req.flash('success', 'Login Successful!');
  }
  else if(flag==0)
  {
    req.flash('success', 'Wrong Password,Try again!');
  }
  else{
    req.flash('success', 'Email does not exists,Try again!');
  }
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
