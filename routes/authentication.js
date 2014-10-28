/**
 * authentication.js
 * ---------
 * Routes for user authentication
 */
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/User');

// Export a function that initializes the authentication config for our app.
module.exports = function(app) {

    // Config passport with the methods from passport-local-mongoose
    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    // Initialize passport
    app.use(passport.initialize());
    app.use(passport.session());

    // Make the username available to templates if the user is logged in.
    app.use(function(req, res, next) {
        var user = req.user;
        if (user) {
            res.locals.user = {
                username: user.username
            };
        }
        next();
    });

    // Render the registration form
    app.get('/register', function(req, res) {
        res.render('register', {
            title: "Bookmarks | Create a new account"
        });
    });

    // Handle registration submit
    app.post('/register', function(req, res) {
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
    app.get('/login', function(req, res) {
        res.render('login', {
            title: "Bookmarks | Log in",
            user: req.user
        });
    });

    // Respond to post requests for login page.
    app.post('/login', function(req, res, next) {
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
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};