const mongoose = require('mongoose')
const Schema = mongoose.Schema

 var User = mongoose.Schema({
    username:{
        type : String
    },
    password:{
        type : String
    },
    name:{
        type:String
    },
    phone:{
        type : String
    },
    email:{
        type : String
    },
    age:{
        type: Number
    },
    height:{
        type: Number
    },
    weight:{
        type: Number
    },
    dob:{
        type : String
    },
    gender:{
        type : String
    }

  });
module.exports = mongoose.model("User", User)