const mongoose = require('mongoose')
const Schema = mongoose.Schema
var calorieburn={
    date:{
        type:Date
    },
    calorie:{
        type:Number
    }
};

var calorieconsume={
    date:{
        type:Date
    },
    caloriecons:{
        type:Number
    }
};

 var CalorieCount = mongoose.Schema({
    username:{
        type : String
    },
    caloriesBurn:{
        type:[calorieburn]
    },
    caloriesConsume:{
        type:[calorieconsume]
    }

  });
module.exports = mongoose.model("CalorieCount", CalorieCount)