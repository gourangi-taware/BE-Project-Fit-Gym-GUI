const express = require('express')
const app = express();
var path = require("path");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
var session = require('express-session');
var flash = require('express-flash');
const { engine } = require('express-handlebars');
var cookieParser = require('cookie-parser');
const Clarifai = require('clarifai');
const axios = require('axios');

// console.log(d3);

//mongo db connection
mongoose.connect('mongodb://localhost:27017/fitapp');

var sessionStore = new session.MemoryStore;
app.engine('handlebars',engine({ defaultLayout: false }));
app.set('view engine', 'handlebars');

app.use(cookieParser('secret'));
app.use(session({
    cookie: { maxAge: 60000 },
    store: sessionStore,
    saveUninitialized: true,
    resave: 'true',
    secret: 'secret'
}));
app.use(flash());

// Custom flash middleware -- from Ethan Brown's book, 'Web Development with Node & Express'
app.use(function(req, res, next){
    // if there's a flash message in the session request, make it available in the response, then delete it
    res.locals.sessionFlash = req.session.sessionFlash;
    delete req.session.sessionFlash;
    next();
});

//router pages
const exercises = require("./routes/exercise");
const models = require("./routes/models");
const register = require("./routes/register");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname + "/public")));

var myClarifaiApiKey = '57116ee76b5144e9a3a1a67aac662950';
var myWolframAppId = '2627HJ-X3TYP8G66K';

var appli = new Clarifai.App({apiKey: myClarifaiApiKey});

//routes
app.use("/exercise", exercises.routes);
app.use("/models", models.routes);
app.use("/register", register.routes);

//routes
app.get('/', (req, res) => {
    res.render('index', { expressFlash: req.flash('success'), sessionFlash: res.locals.sessionFlash });

});
app.get('/index.html', (req, res) => {
    res.render('index', { expressFlash: req.flash('success'), sessionFlash: res.locals.sessionFlash });
});

app.get('/exercise', (req, res) => {
    res.sendFile("exercise.html", { root: __dirname + "/views" });
});

app.get('/testdiet', (req, res) => {
    res.sendFile("testdiet.html", { root: __dirname + "/views" });
});

app.get('/profile', (req, res) => {
    res.sendFile("profile.html", { root: __dirname + "/views" });
});

var port = process.env.PORT || 5000;

app.listen(port, () => console.log("server running at port " + port));
