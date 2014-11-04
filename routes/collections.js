/**
 * collections - Routes for the collections.
 */
var express = require('express');
var ensureLogin = require('connect-ensure-login');
var ensureAuthenticated = ensureLogin.ensureAuthenticated;

// Define and export the router.
var router = module.exports = express.Router();
router.use('/collections/', ensureAuthenticated('/login'));

// Register collection routes.
router.get('/collections/:collection', function(req, res, next) {
    // Find all of the bookmarks and render newest to oldest
    res.render('collection', {
        title: "Bookmarks | " + res.locals.collection.name
    });
});
router.route('/collections/:collection/edit')
    .get(function(req, res, next) {
        // Find all of the bookmarks and render newest to oldest
        res.render('collection_edit', {
            title: "Bookmarks | Edit " + res.locals.collection.name
        });
    })
    .post(function(req, res, next) {
        var collection = req.collection;
        collection.set({
            name: req.body.name,
            description: req.body.description,
            //path: slugify(req.body.path)  // Changing the path requires updating all bookmarks... Let's not do that quite yet.
        });
        collection.save(function(err) {
            res.redirect('/collections/' + collection.path);
        });
    });

router.param('collection', function(req, res, next, path) {
    req.user.getCollection(path, function(err, collection) {
        if (err) {
            return next(err);
        }
        if (collection) {
            collection.findBookmarks().sort('-created').lean().exec(function(err, bookmarks) {
                req.collection = res.locals.collection = collection;
                res.locals.bookmarks = bookmarks;
                return next(err);
            });
        }
        else {
            res.status(404).render('index', {
                title: "Bookmarks | Collection does not exist.",
                notification: {
                    severity: "error",
                    message: "That collection doesn't exist."
                }
            });
        }
    });
});