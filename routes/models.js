const path = require('path');

const express = require('express');
const models = require('./models');
const router = express.Router();

router.get('/bicepcurlmodel', (req, res) => {
    res.render('bicepcurlmodel.html');  
});

router.get('/squatsmodel', (req, res) => {
    res.render('squatsmodel.html');  
});

router.get('/lungesmodel', (req, res) => {
    res.render('lungesmodel.html');  
});

router.get('/pushupsmodel', (req, res) => {
    res.render('pushupsmodel.html');  
});

router.get('/jumpingjacksmodel', (req, res) => {
    res.render('jumpingjacksmodel.html');  
});

router.get('/wall-push-ups-model', (req, res) => {
    res.render('wall-push-ups-model.html');  
});
exports.routes = router;