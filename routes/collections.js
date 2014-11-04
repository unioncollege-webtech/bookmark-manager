/**
 * collections - Routes for the collections.
 */
var express = require('express');
var ensureLogin = require('connect-ensure-login');
var ensureAuthenticated = ensureLogin.ensureAuthenticated;

// Define and export the router.
var router = module.exports = express.Router();

// Register collection routes.
router.get('/collections/:collection', ensureAuthenticated('/login'), function(req, res, next) {
    if (req.user) {
        // Find all of the bookmarks and render newest to oldest
        req.user.findBookmarks().and({
            collections: req.params.collection
        }).sort('-created').lean().exec(function(err, bookmarks) {
            res.render('index', {
                title: "Bookmarks | " + req.params.collection,
                bookmarks: bookmarks
            });
        });
    }
    else {
        // This should never happen.
        res.redirect('/');
    }
});
