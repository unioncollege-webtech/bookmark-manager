/**
 * bookmarks - Routes for the /bookmark section of the website.
 */
var express = require('express');
var ensureLogin = require('connect-ensure-login');
var ensureAuthenticated = ensureLogin.ensureAuthenticated;

exports.setup = function() {
    var router = express.Router();

    // Register Routes
    router.get('/', list);
    router.all('/bookmarks/*', ensureAuthenticated('/login'));
    router.get('/bookmarks', function(req, res, next) {
        res.redirect('/');
    });
    router.route('/bookmarks/add').get(edit).post(save);
    router.route('/bookmarks/:bookmark').get(view);
    router.route('/bookmarks/:bookmark/edit').get(edit).post(save);
    router.route('/bookmarks/:bookmark/delete').post(remove);

    /**
     * :bookmark - Find bookmark by id and store it on the request for
     *             routes with :bookmark param.
     */
    router.param("bookmark", function(req, res, next, id) {
        req.user.findBookmarkById(id, function(err, bookmark) {
            if (bookmark) {
                req.bookmark = bookmark;
                // Err should be null, but pass it along if we have it.
                next(err);
            }
            else {
                if (err) {
                    console.warn("Caught error fetching bookmark id " + id, err);
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

    /**
     * list - Render the bookmarks as a list.
     */
    function list(req, res, next) {
        if (req.user) {
            // Find all of the bookmarks and render newest to oldest
            req.user.findBookmarks().sort('-created').lean().exec(function(err, bookmarks) {
                res.render('index', {
                    title: "Bookmarks",
                    bookmarks: bookmarks
                });
            });
        }
        else {
            res.render('index', {
                title: "Bookmarks - Welcome!"
            });
        }
    }

    /**
     * save - Save a new bookmark or persist changes to an existing one.
     */
    function save(req, res, next) {
        if (!req.user) {
            // This shouldn't happen.
            return res.status(401).send("Not authorized.");
        }

        // If they clicked the 'delete' button, delete the bookmark instead of save.
        if (req.body.action === 'delete') {
            return remove(req, res, next);
        }

        var bookmark = req.bookmark;
        if (!bookmark) {
            bookmark = req.user.newBookmark();
        }

        // Update the bookmark with the posted values.
        bookmark.set({
            href: req.body.url,
            title: req.body.title || req.body.url,
            description: req.body.description || ''
        });

        // Save the bookmark.
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

    /**
     * remove - Remove/delete a bookmark from the database.
     */
    function remove(req, res, next) {
        if (!req.user) {
            // This shouldn't happen.
            return res.status(401).send("Not authorized.");
        }

        var bookmark = req.bookmark;
        if (bookmark) {
            console.warn("Deleting bookmark:", bookmark);
            req.user.removeBookmark(bookmark, function(err) {
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

    /**
     * edit - Render a form to edit an existing bookmark.
     */
    function edit(req, res, next) {
        var bookmark = req.bookmark;
        if (bookmark) {
            res.render('bookmark_edit', {
                title: "Edit bookmark: " + bookmark.title,
                bookmark: bookmark
            });
        }
        else {
            // Render an empty bookmark edit form.
            res.render('bookmark_edit', {
                title: "New bookmark",
            });
        }
    }

    /**
     * view - Show the full details for an existing bookmark.
     */
    function view(req, res, next) {
        var bookmark = req.bookmark;
        res.render('bookmark', {
            title: "Bookmark: " + bookmark.title,
            bookmark: bookmark
        });
    }

    return router;
};