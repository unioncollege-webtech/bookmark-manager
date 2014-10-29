/**
 * authentication.js
 * ---------
 * Routes for user authentication
 */
var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/User');

// Export a function that initializes the authentication config for our app.
exports.setup = function() {

    var router = express.Router();

    // Config passport with the methods from passport-local-mongoose
    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    // Initialize passport
    router.use(passport.initialize());
    router.use(passport.session());

    // Make the username available to templates if the user is logged in.
    router.use(function(req, res, next) {
        var user = req.user;
        if (user) {
            res.locals.user = {
                username: user.username
            };
        }
        next();
    });

    // Render the registration form
    router.route('/register')
        .get(function(req, res) {
            res.render('register', {
                title: "Bookmarks | Create a new account"
            });
        })
        .post(function(req, res) {
            User.register(new User({
                username: req.body.username
            }), req.body.password, function(err, user) {
                if (err) {
                    return res.render('register', {
                        title: "Bookmarks | Create a new account",
                        notification: {
                            severity: "error",
                            message: "Unable to register user: " + err.message
                        },
                        user: user
                    });
                }
                // Authenticate (log in) the new user.
                passport.authenticate('local')(req, res, function() {
                    res.redirect('/');
                });
            });
        });

    // Render the login form.
    router.route('/login')
        .get(function(req, res) {
            res.render('login', {
                title: "Bookmarks | Log in",
                user: req.user
            });
        })
        .post(function(req, res, next) {
            // Authenticate the user
            passport.authenticate('local', function(err, user, info) {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return res.render('login', {
                        title: "Bookmarks | Log in",
                        notification: {
                            severity: 'error',
                            message: "The username and password you provided is incorrect. Please try again."
                        }
                    });
                }
                // Log the user in and redirect to the homepage.
                req.login(user, function(err) {
                    if (err) {
                        return next(err);
                    }
                    return res.redirect('/');
                });
            })(req, res, next);
        });

    // Log the user out and redirect to the homepage.
    router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    return router;
};