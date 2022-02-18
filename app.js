const express = require('express')
const app = express();
var path = require("path");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
const { engine } = require('express-handlebars');
var cookieParser = require('cookie-parser');
//mongo db connection
mongoose.connect('mongodb://localhost:27017/fitapp');


app.engine('handlebars',engine({ defaultLayout: false }));
app.set('view engine', 'handlebars');

//router pages
const exercises = require("./routes/exercise");
const models=require("./routes/models");
const register = require("./routes/register");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname + "/public")));


//routes
app.use("/exercise", exercises.routes);
app.use("/models",models.routes);
app.use("/register",register.routes);

//routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/exercise', (req, res) => {
    res.sendFile("exercise.html", { root: __dirname + "/views" });
});


var port = process.env.PORT || 5000;

app.listen(port, () => console.log("server running at port " + port));

