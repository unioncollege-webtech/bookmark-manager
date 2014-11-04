/**
 * errors - Register error handling and catch-all routes.
 */
var express = require('express');

// Define and export the router.
var router = module.exports = express.Router();

// 404 Not Found handler
router.use(function(req, res) {
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
router.use(function(err, req, res, next) {
    console.error(err);

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
