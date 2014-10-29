var express = require('express'),
    mongoose = require('mongoose'),
    hbs = require('hbs'),
    hbsutils = require('hbs-utils'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    bookmarklet = require('./public/scripts/bookmarklet'),
    routes = require('./routes/');

// Create a new express app.
var app = express();

// Register the hbs engine for the 'html' extension
app.set('view engine', 'html');
app.engine('html', hbs.__express);
// Set up template partials
hbsutils(hbs).registerWatchedPartials('views/partials');

// Set config variables
app.set('hostname', 'webtech-c9-barberboy.c9.io');
app.set('port', process.env.PORT || 3000);
app.set('ip', process.env.IP || '127.0.0.1');
app.set('dbhost', (process.env.IP || 'localhost'));
app.set('dbname', 'bookmarks');

// Serve files in /public as static files
app.use(express.static('public'));

// Parse the body of 'post' requests
app.use(bodyParser.urlencoded({
    extended: false
}));

// Enable sessions and cookies for authentication.
app.use(cookieParser('Courage, dear heart.'));
app.use(session({
    secret: 'What makes a king out of a slave? Courage!',
    resave: true,
    saveUninitialized: true
}));

// Encode the bookmarklet function and make available to templates.
var bookmarkletTemplate = hbs.handlebars.compile(bookmarklet.toString());
app.locals.bookmarklet = encodeURIComponent(bookmarkletTemplate({
    hostname: app.get('hostname')
}));

// Set up our routes
app.use(routes.setup(app));

// Connect to mongoose server.
mongoose.connect('mongodb://' + app.get('dbhost') + '/' + app.get('dbname'));

// Start the server
var server = app.listen(app.get('port'), app.get('ip'), function() {
    var address = server.address();
    console.log("Bookmark service up on http://%s:%s",
        address.address, address.port);
});