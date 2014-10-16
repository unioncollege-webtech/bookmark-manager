var express = require('express');
var bodyParser = require('body-parser');
var hbs = require('hbs');
var hbsutils = require('hbs-utils')(hbs);

// Connect to our mongod server
var mongoose = require('mongoose');
mongoose.connect('mongodb://' + (process.env.IP || 'localhost') + '/bookmarks');

// Load the Bookmark model
var Bookmark = require('./models/Bookmark');

// Create a new express app.
var app = express();

// Register the hbs engine for the 'html' extension
app.set('view engine', 'html');
app.engine('html', hbs.__express);

// Set up template partials
hbsutils.registerWatchedPartials('views/partials');

// Set the port and ip address (just as a convenience)
app.set('port', process.env.PORT || 3000);
app.set('ip', process.env.IP || '127.0.0.1');

// Serve files in /public as static files
app.use(express.static('public'));

// Parse the body of 'post' requests
app.use(bodyParser.urlencoded({
    extended: false
}));

// Encode the bookmarklet function and make available to templates.
var bookmarklet = require('./public/scripts/bookmarklet');
app.locals.bookmarklet = encodeURIComponent(bookmarklet);

// Enable cross-origin posts to /bookmarks/add (to support bookmarklet)
app.use(function(req, res, next) {
    res.set('Access-Control-Allow-Origin', '*');
    next();
});

// Find bookmark by id and store on the response for routes with :bookmark param
app.param("bookmark", function(req, res, next, id) {
    Bookmark.findById(id, function(err, bookmark) {
        if (bookmark) {
            res.bookmark = bookmark;
            next(err);
        }
        else {
            if (err) {
                console.log("Caught error fetching bookmark id " + id, err);
            }
            res.status(404).render('bookmark', {
                title: "Bookmark does not exist.",
                notification: {
                    severity: "error",
                    message: "Oh, snap—no bookmark exists with that id! ☹"
                }
            });
        }
    });
});

// Register the the index route
app.get('/', function(req, res, next) {
    // Find all of the bookmarks and render newest to oldest
    Bookmark.find().sort('-created').exec(function(err, bookmarks) {
        res.render('index', {
            title: "Bookmarks",
            bookmarks: bookmarks
        });
    });
});


// List all bookmarks
app.get('/bookmarks', function(req, res, next) {
    // Currently, just redirect to the homepage.
    res.redirect('/');
});

// Show an edit form to add a new bookmark.
app.get('/bookmarks/add', function(req, res, next) {
    // Render an empty bookmark edit form.
    res.render('bookmark_edit', {
        title: "New bookmark",
    });
});

// Handle form posts for new bookmarks
app.post('/bookmarks/add', saveBookmark);

function saveBookmark(req, res, next) {
    // If they clicked the 'delete' button, delete the bookmark instead of save.
    if (req.body.action === 'delete') {
        return deleteBookmark(req, res, next);
    }

    var bookmark = res.bookmark;
    if (!bookmark) {
        bookmark = new Bookmark();
        bookmark.created = Date();
    }

    bookmark.set({
        url: req.body.url,
        title: req.body.title || req.body.url,
        description: req.body.description || ''
    });

    bookmark.save(function(err) {
        if (err) {
            if (err.name === 'ValidationError') {
                // Validation Error
                var notifications = [];
                for (var validator in err.errors) {
                    notifications.push({
                        severity: "error",
                        message: err.errors[validator].message
                    });
                }
                res.render('bookmark_edit', {
                    title: "Edit bookmark: " + bookmark.title,
                    bookmark: bookmark,
                    notification: notifications
                });
            }
            else {
                // General error
                res.render('bookmark_edit', {
                    title: "Error saving bookmark: " + bookmark.title,
                    bookmark: bookmark,
                    notification: {
                        severity: "error",
                        message: "A bad thing happened: " + err
                    }
                });
            }
        }
        else {
            res.redirect('/');
        }
    });
}

function deleteBookmark(req, res, next) {

    var bookmark = res.bookmark;
    if (bookmark) {
        console.warn("Deleting bookmark:", bookmark);

        Bookmark.remove(bookmark, function(err) {
            if (err) {
                res.render('bookmark_edit', {
                    title: "Delete bookmark failed!",
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
}

// Respond to requests for a specific bookmark
app.get('/bookmarks/:bookmark', function(req, res, next) {
    var bookmark = res.bookmark;
    res.render('bookmark', {
        title: "Bookmark: " + bookmark.title,
        bookmark: bookmark
    });
});

// Render the edit form for a bookmark.
app.get('/bookmarks/:bookmark/edit', function(req, res, next) {
    var bookmark = res.bookmark;
    res.render('bookmark_edit', {
        title: "Edit bookmark: " + bookmark.title,
        bookmark: bookmark
    });
});

// Persist edits for a bookmark
app.post('/bookmarks/:bookmark/edit', saveBookmark);
// Delete a bookmark
app.post('/bookmarks/:bookmark/delete', deleteBookmark);

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