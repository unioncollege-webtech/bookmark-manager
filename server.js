var path = require('path');
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var serveStatic = require('serve-static')

var routes = require('./routes')

// Create a new express app.
var app = express();

// Use the 'pub' template engine
app.set('view engine', 'pug');

// Set config variables
var port = process.env.PORT || 8080;
var ip = process.env.IP || '127.0.0.1';
var dbhost = process.env.IP || 'localhost'
var dbname = 'bookmark-manager';

// Connect to mongoose server.
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://' + dbhost + '/' + dbname);

// Serve files in 'public' as static files
app.use(serveStatic('public'))

// Parse the body of 'post' requests
app.use(bodyParser.urlencoded({
  extended: false
}));

// Set up the routes
app.use(routes);

// Start the server
app.listen(port, ip, function() {
  console.log("Bookmark service up!");
});