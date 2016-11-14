var express = require('express');
var Bookmark = require('../models/Bookmark');

// Define and export the router.
var router = module.exports = express.Router();

// Register Routes
router.get('/', list);

router.get('/bookmarks', function(req, res, next) {
    res.redirect('/');
});

router.route('/bookmarks/add')
  .get(edit)
  .post(save);

router.route('/bookmarks/:bookmark')
  .get(view);

router.route('/bookmarks/:bookmark/edit')
  .get(edit)
  .post(save);

router.route('/bookmarks/:bookmark/delete')
  .post(remove);

/**
 * :bookmark - Find bookmark by id and store it on the request for
 *             routes with :bookmark param.
 */
router.param('bookmark', function(req, res, next, id) {
    Bookmark.findById(id, function(err, doc) {
        if(err) {
            return next(err);
        }
        
        if(doc) {
            req.bookmark = doc;
            next()
        } 
        else {
            res.status(404).render('bookmark_view', {
                title: 'Bookmark does not exist.'
            });
        }
    })
});


/**
 * view - Show the full details for an existing bookmark.
 */
function view(req, res, next) {
    var bookmark = req.bookmark;
    res.render('bookmark_view', {
        title: 'Bookmark: ' + bookmark.title,
        bookmark: bookmark
    });
}

/**
 * edit - Render a form to edit a new or existing bookmark.
 */
function edit(req, res, next) {
    var bookmark = req.bookmark;
    
    if (bookmark) {
        res.render('bookmark_edit', {
            title: 'Edit bookmark: ' + bookmark.title,
            bookmark: bookmark
        });
    }
    else {
        // Render an empty bookmark edit form.
        res.render('bookmark_edit', {
            title: 'New bookmark',
            bookmark: {}
        });
    }
}

/**
 * list - Render the bookmarks as a list.
 */
function list(req, res, next) {
    // Find all of the bookmarks and render newest to oldest
    Bookmark.find().sort('-created').exec(function(err, bookmarks) {
    
        if(err) {
            return next(err)
        }
        
        res.render('index', {
            title: 'Bookmarks',
            bookmarks: bookmarks
        });
    });
}

/**
 * save - Save a new bookmark or persist changes to an existing one.
 */
function save(req, res, next) {
    // If they clicked the 'delete' button, delete the bookmark instead of save.
    if (req.body.action === 'delete') {
        return remove(req, res, next);
    }

    var bookmark = req.bookmark;
    if (!bookmark) {
        bookmark = Bookmark()
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
            return res.render('bookmark_edit', {
                title: 'Error saving bookmark: ' + bookmark.title,
                bookmark: bookmark,
                notification: {
                    severity: 'error',
                    message: 'A bad thing happened: ' + err
                }
            });
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
    var bookmark = req.bookmark;

    if (bookmark) {
        console.warn('Deleting bookmark:', bookmark);
        
        Bookmark.remove(bookmark, function(err) {
            if (err) {
                res.render('bookmark_edit', {
                    title: 'Delete bookmark failed!',
                    notification: {
                        severity: 'error',
                        message: 'Could not delete bookmark: ' + err
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
