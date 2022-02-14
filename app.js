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



var port = process.env.PORT || 5000;

app.listen(port, () => console.log("server running at port " + port));

