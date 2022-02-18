const path = require('path');

const express = require('express');
const exercise = require('./exercise');
const { dirname } = require('path');
const router = express.Router();


router.get('/bicepcurl', (req, res) => {
    res.sendFile("bicepcurl.html", { root: path.join(__dirname, '../views')});
});

router.get('/squats', (req, res) => {
    res.sendFile("squats.html", { root: path.join(__dirname, '../views')});
});

router.get('/jumpingjacks', (req, res) => {
    res.sendFile("jumpingjacks.html", { root: path.join(__dirname, '../views')});
});
router.get('/pushups', (req, res) => {
    res.sendFile("pushups.html", { root: path.join(__dirname, '../views')});
});

router.get('/lunges', (req, res) => {
    res.sendFile("lunges.html", { root: path.join(__dirname, '../views')});
});

router.get('/wall-push-ups', (req, res) => {
    res.sendFile("wall-push-ups.html", { root: path.join(__dirname, '../views')});
});

exports.routes = router;
