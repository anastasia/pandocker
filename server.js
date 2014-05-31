var express         = require("express");
var app             = express();
var bodyParser      = require('body-parser');
var errorHandler    = require('errorhandler');
var methodOverride  = require('method-override');
var port            = 3000;
// var port            = parseInt(process.env.PORT, 10) || 4567;
app.get("/", function (req, res) {
  res.redirect("/index.html");
});

app.use(methodOverride());
app.use(bodyParser());
app.use(express.static(__dirname + '/public'));
app.use(errorHandler({
  // dumpExceptions: true,
  // showStack: true
}));

app.listen(port);