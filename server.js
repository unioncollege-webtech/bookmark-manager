var express = require('express');
var hbs = require('hbs');
var bodyParser = require('body-parser');
var JSONModel = require('./JSONModel');

// Load our bookmarks.json data file
var Bookmarks = new JSONModel('./public/data/bookmarks.json');

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

// Parse the body of 'post' requests
app.use(bodyParser.urlencoded({
    extended: false
}));

// Register the the index route
app.get('/', function(req, res, next) {
    res.render('index', {
        title: "Bookmarks",
        bookmarks: Bookmarks.all()
    });
});


// List all bookmarks
app.get('/bookmarks', function(req, res, next) {
    // Currently, just redirect to the homepage.
    res.redirect('/');
});

// Add a new bookmark.
app.get('/bookmarks/add', function(req, res, next) {
    res.render('bookmark_edit', {
        title: "New bookmark",
    });
});
app.post('/bookmarks/add', saveBookmark);

function saveBookmark(req, res, next) {
    var bookmark = {
        id: req.params.id,
        url: req.body.url,
        title: req.body.title || req.body.url,
        description: req.body.description || ''
    };

    //TODO: Validate id and url parameters.

    Bookmarks.save(bookmark, function(err, bookmark) {
        if (err) {
            res.render('bookmark_edit', {
                title: "Edit bookmark: " + bookmark.title,
                bookmark: bookmark,
                notification: {
                    severity: "error",
                    message: "A bad thing happened: " + err
                }
            });
        }
        else {
            res.redirect('/');
        }
    });
}


// Respond to requests for a specific bookmark
app.get('/bookmarks/:id', function(req, res, next) {
    var bookmark = Bookmarks.findById(req.params.id);

    if (bookmark) {
        res.render('bookmark', {
            title: "Bookmark: " + bookmark.title,
            bookmark: bookmark
        });
    }
    else {
        res.render('bookmark', {
            title: "Bookmark does not exist.",
            notification: {
                severity: "error",
                message: "Oh, snap—no bookmark exists with that id! ☹"
            }
        });
    }
});

// Render the edit form for a bookmark.
app.get('/bookmarks/:id/edit', function(req, res, next) {
    var bookmark = Bookmarks.findById(req.params.id);

    if (bookmark) {
        res.render('bookmark_edit', {
            title: "Edit bookmark: " + bookmark.title,
            bookmark: bookmark
        });
    }
    else {
        res.render('bookmark', {
            title: "Bookmark does not exist.",
            notification: {
                severity: "error",
                message: "Oh, snap—no bookmark exists with that id! ☹"
            }
        });
    }
});
// Persist edits for a bookmark
app.post('/bookmarks/:id/edit', saveBookmark);

app.post('/bookmarks/:id/delete', function(req, res, next) {
    var bookmark = Bookmarks.findById(req.params.id);
    if (bookmark) {
        Bookmarks.remove(bookmark, function(err, bookmark) {
            if (err) {
                res.render('bookmark_edit', {
                    title: "Edit bookmark: " + bookmark.title,
                    bookmark: bookmark,
                    notification: {
                        severity: "error",
                        message: "Could not delete bookmark: " + err
                    }
                });
            }
            else {
                res.redirect('/');
            }
        });
    }
    else {
        res.redirect('/');
    }
});

// 404 Not Found handler
app.use(function(req, res) {
    console.warn('404 Not Found: %s', req.originalUrl);

    res.status(404).render('index', {
        notification: {
            severity: "error",
            message: "Oh noes! The page you requested doesn’t exist. That\
                      really sucks."
        }
    });
});


// 500 Internal Error handler
app.use(function(err, req, res, next) {
    console.error(err.stack);

    res.status(500).render('index', {
        notification: {
            severity: "error",
            message: "I’m so sorry, but something is wrong and internal\
                      errors are occuring. This sucks, but the developers have\
                      been alerted and will (hopefully) have the issue resolved\
                      shortly."
        }
    });
});

// Start the server
var server = app.listen(app.get('port'), app.get('ip'), function() {
    var address = server.address();
    console.log("Bookmark service up on http://%s:%s",
        address.address, address.port);
});