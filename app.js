const express = require('express')
const app = express();
var path = require("path");


//app.set("view engine", "ejs");


app.use(express.static(path.join(__dirname + "/public")));

app.get('/', (req, res) => {
    res.sendFile("index.html", { root: __dirname + "/views" });
  
});


var port = process.env.PORT || 5000;

app.listen(port, () => console.log("server running at port " + port));
