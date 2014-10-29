/**
 * routes/index - Set up the routes for the application
 */
var express = require('express');

exports.setup = function(app) {
    var router = express.Router();

    // Enable cross-origin posts (support bookmarklet posts to /bookmarks/add)
    router.use(function(req, res, next) {
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Accept-Encoding, DNT');
        next();
    });

    // Register the routes in order.
    ['authentication', 'bookmarks', 'search', 'errors'].forEach(function(path) {
        var route = require('./' + path);
        router.use(route.setup(app));
    });
    return router;
};