const path = require("path");
var CalorieCount = require('../models/caloriesCount')
const express = require('express');
const router = express.Router();

router.post('/saveData', (req, res) => {
    // res.sendFile('bicepcurlmodel.html',{ root: path.join(__dirname, '../views')});  
});

exports.routes = router;
