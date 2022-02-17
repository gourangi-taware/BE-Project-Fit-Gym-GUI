const express = require('express')
const app = express();
var path = require("path");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");

//mongo db connection
mongoose.connect('mongodb://localhost:27017/fitapp');

app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

//router pages
const exercises = require("./routes/exercise");
const models=require("./routes/models");
const register = require("./routes/register");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname + "/public")));

//routes
app.use("/exercise", exercises.routes);
app.use("/models",models.routes);
app.use("/register",register.routes);

//routes
app.get('/', (req, res) => {
    res.sendFile("index.html", { root: __dirname + "/views" });
});

app.get('/exercise', (req, res) => {
    res.sendFile("exercise.html", { root: __dirname + "/views" });
});

<<<<<<< HEAD
app.get('/login', (req, res) => {
    res.sendFile("login.html", { root: __dirname + "/views" });
});

app.get('/signup', (req, res) => {
    res.sendFile("signup.html", { root: __dirname + "/views" });
});

app.get('/bicepcurl', (req, res) => {
    res.sendFile("bicepcurl.html", { root: __dirname + "/views" });
});

app.get('/squats', (req, res) => {
    res.sendFile("squats.html", { root: __dirname + "/views" });
});
=======
>>>>>>> ad8c5123e811f23a4a1839b6b58b3ad800a6c6a9


var port = process.env.PORT || 5000;

app.listen(port, () => console.log("server running at port " + port));

