const path = require('path');

const express = require('express');
const models = require('./models');
const router = express.Router();

router.get('/bicepcurlmodel', (req, res) => {
    res.sendFile('bicepcurlmodel.html',{ root: path.join(__dirname, '../views')});  
});

router.get('/squatsmodel', (req, res) => {
    res.sendFile('squatsmodel.html',{ root: path.join(__dirname, '../views')});  
});

router.get('/lungesmodel', (req, res) => {
    res.sendFile('lungesmodel.html',{ root: path.join(__dirname, '../views')}); 
});

router.get('/pushupsmodel', (req, res) => {
    res.sendFile('pushupsmodel.html',{ root: path.join(__dirname, '../views')}); 
});

router.get('/jumpingjacksmodel', (req, res) => {
    res.sendFile('jumpingjacksmodel.html',{ root: path.join(__dirname, '../views')});  
});

router.get('/wall-push-ups-model', (req, res) => {
    res.sendFile('wall-push-ups-model.html',{ root: path.join(__dirname, '../views')});  
});
exports.routes = router;