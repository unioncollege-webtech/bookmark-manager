/**
 * search.js
 * ---------
 * Routes for the advanced search feature.
 */
var express = require('express');
var Bookmark = require('../models/Bookmark.js');

// New router instance for the search route.
var search = express.Router();

// Middleware to retrieve the list of hostnames and pass to template.
search.use(function(req, res, next) {
    Bookmark.distinct('url.hostname', function(err, hostnames) {
        res.locals.hostnames = hostnames;
        next(err);
    });
});
// Route for the search query.
search.get('/', function(req, res, next) {
    // Build up the base query object
    var query = {};

    // Keyword is in the 'q' query parameter.
    if (req.query.q) {
        query.$text = {
            $search: req.query.q
        };
    }
    // Do a sub-string match on hostname if the RexExp is not invalid.
    if (req.query.hostname) {
        try {
            query['url.hostname'] = new RegExp(req.query.hostname);
        }
        catch (e) {
            query['url.hostname'] = req.query.hostname;
            console.warn(e);
        }
    }
    // Execute the query.
    Bookmark.find(query).sort('-created').exec(function(err, bookmarks) {
        if (err) {
            return next(err);
        }
        res.render('search', {
            title: "Bookmarks",
            bookmarks: bookmarks,
            query: req.query
        });
    });
});

// Export the search router object.
exports.search = search;