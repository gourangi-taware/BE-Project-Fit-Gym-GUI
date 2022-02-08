const express = require('express')
const app = express();
var path = require("path");

//app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname + "/public")));

app.get('/', (req, res) => {
    res.sendFile("index.html", { root: __dirname + "/views" });
});

app.get('/exercise', (req, res) => {
    res.sendFile("exercise.html", { root: __dirname + "/views" });
});

app.get('/bicepcurl', (req, res) => {
    res.sendFile("bicepcurl.html", { root: __dirname + "/views" });
});

app.get('/squats', (req, res) => {
    res.sendFile("squats.html", { root: __dirname + "/views" });
});

app.get('/jumpingjacks', (req, res) => {
    res.sendFile("jumpingjacks.html", { root: __dirname + "/views" });
});
app.get('/pushups', (req, res) => {
    res.sendFile("pushups.html", { root: __dirname + "/views" });
});

app.get('/lunges', (req, res) => {
    res.sendFile("lunges.html", { root: __dirname + "/views" });
});

app.get('/wall-push-ups', (req, res) => {
    res.sendFile("wall-push-ups.html", { root: __dirname + "/views" });  
});

var port = process.env.PORT || 5000;

app.listen(port, () => console.log("server running at port " + port));

