/**
 * bookmarks - Routes for the /bookmark section of the website.
 */
var express = require('express');
var Bookmark = require('../models/Bookmark');

exports.setup = function() {
    var router = express.Router();

    // Register Routes
    router.get('/', listBookmarks);
    router.get('/bookmarks', function(req, res, next) {
        res.redirect('/');
    });
    router.route('/bookmarks/add')
        .get(newBookmark)
        .post(saveBookmark);
    router.get('/bookmarks/:bookmark', viewBookmark);
    router.route('/bookmarks/:bookmark/edit')
        .get(editBookmark)
        .post(saveBookmark);
    router.post('/bookmarks/:bookmark/delete', deleteBookmark);


    /**
     * :bookmark param - Find bookmark by id and store it on the response for
     *                   routes with :bookmark param
     */
    router.param("bookmark", function(req, res, next, id) {
        Bookmark.findById(id, function(err, bookmark) {
            if (bookmark) {
                res.bookmark = bookmark;
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
     * listBookmarks - Render the bookmarks as a list.
     */
    function listBookmarks(req, res, next) {
        // Find all of the bookmarks and render newest to oldest
        Bookmark.find().sort('-created').exec(function(err, bookmarks) {
            res.render('index', {
                title: "Bookmarks",
                bookmarks: bookmarks
            });
        });
    }

    /**
     * saveBookmark - Save a new bookmark or persist changes to an existing one.
     */
    function saveBookmark(req, res, next) {
        // If they clicked the 'delete' button, delete the bookmark instead of save.
        if (req.body.action === 'delete') {
            return deleteBookmark(req, res, next);
        }

        var bookmark = res.bookmark;
        if (!bookmark) {
            bookmark = new Bookmark();
        }

        bookmark.set({
            href: req.body.url,
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

    /**
     * deleteBookmark - Remove/delete a bookmark from the database.
     */
    function deleteBookmark(req, res, next) {
        var bookmark = res.bookmark;

        if (bookmark) {
            console.warn("Deleting bookmark:", bookmark);

            Bookmark.remove({
                _id: bookmark._id
            }, function(err) {
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
     * newBookmark - Render a form for a new bookmark.
     */
    function newBookmark(req, res, next) {
        // Render an empty bookmark edit form.
        res.render('bookmark_edit', {
            title: "New bookmark",
        });
    }

    /**
     * editBookmark - Render a form to edit an existing bookmark.
     */
    function editBookmark(req, res, next) {
        var bookmark = res.bookmark;
        res.render('bookmark_edit', {
            title: "Edit bookmark: " + bookmark.title,
            bookmark: bookmark
        });
    }

    /**
     * viewBookmark - Show the full details for an existing bookmark.
     */
    function viewBookmark(req, res, next) {
        var bookmark = res.bookmark;
        res.render('bookmark', {
            title: "Bookmark: " + bookmark.title,
            bookmark: bookmark
        });
    }

    return router;
};