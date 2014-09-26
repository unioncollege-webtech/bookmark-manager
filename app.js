var express = require('express');
var hbs = require('hbs');
// Load our bookmarks.json data file
var bookmarks = require('./public/data/bookmarks.json');


// Create a new express app.
var app = express();

// Register the hbs engine for the 'html' extension
app.set('view engine', 'html');
app.engine('html', hbs.__express);

// Set the port and ip address (just as a convenience)
app.set('port', process.env.PORT || 3000);
app.set('ip', process.env.IP || '127.0.0.1');

// Serve files in /public as static files
app.use(express.static('public'));


// Register the the index route
app.get('/', function(req, res, next) {
    res.render('index', {
        title: "Bookmarks",
        bookmarks: bookmarks
    });
});


// List all bookmarks
app.get('/bookmarks', function(req, res, next){
    // Currently, just redirect to the homepage.
   res.redirect('/');
});


// Respond to requests for a specific bookmark
app.get('/bookmarks/:id', function(req, res, next) {
    var bookmark = bookmarks.filter(function(bookmark) {
        return bookmark.id == req.params.id;
    })[0];

    if (bookmark) {
        res.render('bookmark', {
            title: "Bookmark: " + bookmark.title,
            bookmark: bookmark
        });
    }
    else {
        res.render('bookmark', {
            title: "Bookmark does not exist.",
            error: {
                message: "Oh, snap—no bookmark exists with that id! ☹"
            }
        });
    }
});


// 404 Not Found handler
app.use(function(req, res) {
    console.warn('404 Not Found: %s', req.originalUrl);
    res.status(404).render('index', {
        error: {
            message: "Oh noes! The page you requested doesn’t exist. That really sucks."
        }
    });
});


// 500 Internal Error handler
app.use(function(err, req, res, next) {
    console.error(err.stack);

    res.status(500).render('index', {
        error: {
            message: "I’m so sorry, but something is wrong and internal\
        errors are occuring. This sucks, but the developers have been alerted\
        and will (hopefully) have the issue resolved shortly."
        }
    });
});

// Start the server
var server = app.listen(app.get('port'), app.get('ip'), function() {
    var address = server.address();
    console.log("Bookmark service up on http://%s:%s",
        address.address, address.port);
});