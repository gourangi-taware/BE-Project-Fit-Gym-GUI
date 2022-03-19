const path = require("path");
var User = require('../models/users')
const express = require('express');
const Clarifai = require('clarifai');
const axios = require('axios');

var myClarifaiApiKey = '57116ee76b5144e9a3a1a67aac662950';
var myWolframAppId = '2627HJ-X3TYP8G66K';

var app = new Clarifai.App({apiKey: myClarifaiApiKey});


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

// var nutrients=axios.get('https://api.edamam.com/api/food-database/v2/parser?app_id=729b8943&app_key=6e8a020bc1554d5e11784353ec417be6&ingr=Apple&nutrition-type=cooking')
//   .then(response => {
//     console.log(response.data.url);
//     console.log(response.data.explanation);
//     return response.text;
//   })
//   .catch(error => {
//     console.log(error);
//   });

router.post('/diet',async function(req, res, next) {
  // console.log(req.body);
  console.log("In diet post request");
  var resi=await doPredict(req.body);
  console.log(resi);
  var nutrients=await axios.get('https://api.edamam.com/api/food-database/v2/parser?app_id=729b8943&app_key=6e8a020bc1554d5e11784353ec417be6&ingr='+resi.tag+'&nutrition-type=cooking')
  .then(response => {
    console.log(response.data);
    console.log(response.data.parsed[0].food);
    return response.data.parsed[0].food;
    
  })
  .catch(error => {
    console.log(error);
  });
  return res.send(nutrients);
});

 async function doPredict(value) {
  
  var item=await app.models.predict(Clarifai.FOOD_MODEL, value).then(async function(response) {
    console.log("In doPredict");
      if(response.rawData.outputs[0].data.hasOwnProperty("concepts")) {
        var tag = response.rawData.outputs[0].data.concepts[0].name;
        console.log(tag);
        var url = 'http://api.wolframalpha.com/v2/query?input='+tag+'%20nutrition%20facts&appid='+myWolframAppId;
        console.log(url);
        // var res=await getNutritionalInfo(url, function (result) {
        //   console.log("In getnutritional value");
        //   console.log(url);
        //   console.log(result);
          
        //   // $('#concepts').html('<h3>'+ tag + '</h3>' + "<img src='"+result+"'>");
        // });
        return {tag:tag,url:url};
        
      }
    }, function(err) { console.log(err); }
  );
  return item;
}

exports.routes = router;
exports.users=users;
