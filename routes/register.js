const path = require("path");
var User = require('../models/users')
const express = require('express');

const router = express.Router();
const users=[];


router.get('/register-user', (req, res, next) => {
  users.push({username:"Gourangi",password:"Taware",phone:"9730545892",email:"gourangi0309@gmail.com",age:"22",height:5.2,weight:50,dob:"03/09/2000",gender:"female"});
  var username="Gourangi";
  var password="Taware";
  var phone="9730545892";
  var email="gourangi0309@gmail.com";
  var age=22;
  var height=5.2;
  var weight=50;
  var dob="03/09/2000";
  var gender="female";
  
  var userdata={
    username:username,
    password:password,
    phone:phone,
    email:email,
    age:age,
    height:height,
    weight:weight,
    dob:dob,
    gender:gender
  };
  new User(userdata).save();
   res.redirect('/');
});

exports.routes = router;
exports.users=users;
