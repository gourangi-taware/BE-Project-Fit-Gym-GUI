const path = require('path');

const express = require('express');
const exercise = require('./exercise');
const router = express.Router();


router.get('/bicepcurl', (req, res) => {
    res.render('bicepcurl.html');
});

router.get('/squats', (req, res) => {
    res.render('squats.html');
});

router.get('/jumpingjacks', (req, res) => {
    res.render('jumpingjacks.html');
});
router.get('/pushups', (req, res) => {
    res.render('pushups.html');
});

router.get('/lunges', (req, res) => {
    res.render('lunges.html');
});

router.get('/wall-push-ups', (req, res) => {
    res.render('wall-push-ups.html');  
});

exports.routes = router;