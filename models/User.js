var mongoose = require('mongoose');
var Bookmark = require('./Bookmark');

// User schema
var User = mongoose.Schema({
    /**
     * username - The selected username, as a String.
     */
    username: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    }
    // passport-local-mongoose creates 'hash' and 'salt' properties.
});

// Set up the passport-local-mongoose plugin
User.plugin(require('passport-local-mongoose'));

/**
 * user.findBookmarks( callback ) - Find the bookmarks associated with a user.
 * ---------------------------------------------------------------------------
 * user.findBookmarks() returns the bookmarks associated with the User.
 *
 * Similar to Bookmark.find(), this method will execute the query and pass the
 * results to `callback` if callback is provided. If a callback function is not
 * provided, `.findForUser` will return a query builder allowing you to add
 * additional search constraints, sort, or run distinct() commands.
 *
 * The method takes the following arguments:
 *
 * - callback(err, bookmarks): (Optional) A Function to pass the query results
 *                             to. If `callback` is not passed, a query builder
 *                             is returned.
 *
 *                             `callback` will be executed with the following
 *                             arguments:
 *
 *                             - err: The Error object if an error occured.
 *                             - bookmarks: An Array of Bookmarks that match the
 *                                          query criteria.
 *
 * Example:
 *
 *     // Search for and render all the bookmarks for a user.
 *     var user = req.user;
 *     user.findBookmarks(function(err, bookmarks) {
 *         if(err) {
 *            return next(err);
 *         }
 *         res.render('index', {
 *             title: 'Bookmarks',
 *             bookmarks: bookmarks,
 *         })
 *     });
 *
 *     // Use the query builder to build a more complex query.
 *     var user = req.user;
 *     user.findBookmarks().skip(10).limit(10).sort('-created').lean().exec(function(err, bookmarks) {
 *         if(err) {
 *            return next(err);
 *         }
 *         res.render('index', {
 *             title: 'Bookmarks',
 *             bookmarks: bookmarks,
 *         })
 *     });
 */
User.methods.findBookmarks = function(callback) {
    return Bookmark.find({
        user_id: this._id
    }, callback);
};

/**
 * user.findBookmarkById( id, callback )
 * -------------------------------------
 * Query the user's bookmarks to find one whose _id matches the passed id.
 *
 * Similar to Bookmark.findOne(), this method will execute the query and pass the
 * results to `callback` if callback is provided. If a callback function is not
 * provided, `.findForUser` will return a query builder allowing you to add
 * additional search constraints, sort, or run distinct() commands.
 *
 * The method takes the following arguments:
 *
 * - callback(err, boookmark): (Optional) A Function to pass the query results
 *                             to. If `callback` is not passed, a query builder
 *                             is returned.
 *
 *                             `callback` will be executed with the following
 *                             arguments:
 *
 *                             - err: The error object if an error occured.
 *                             - bookmark: The bookmark if a match was found.
 *
 * Example:
 *
 *     // Search for and render all the bookmarks for a user.
 *     var user = req.user;
 *     user.findBookmarkById(id, function(err, bookmark) {
 *         if(err) {
 *            return next(err);
 *         }
 *         if (!bookmark) {
 *             return res.status(404).send('Bookmark not found');
 *         }
 *
 *         res.render('bookmark', {
 *             title: 'Bookmark details',
 *             bookmark: bookmark
 *         });
 *     });
 */
User.methods.findBookmarkById = function(id, callback) {
    return Bookmark.findOne({
        user_id: this._id,
        _id: id
    }, callback);
};

/**
 * newBookmark() - Create a new bookmark for the user.
 * ---------------------------------------------------
 * Create and return a new bookmark that's associated with the user.
 *
 * Example:
 *
 *     // Get the logged-in user.
 *     var user = req.user;
 *     // Create a new bookmark for the user.
 *     var bookmark = user.newBookmark();
 *     bookmark.set({
 *         href: "https://duckduckgo.com/",
 *         title: "Duck Duck Go!"
 *     });
 *     // Persist the bookmark.
 *     bookmark.save(function(err, bookmark){
 *         if (err) { return next(err); };
 *         res.redirect('/');
 *     });
 *
 * Returns a new Bookmark document.
 */
User.methods.newBookmark = function() {
    var bookmark = new Bookmark();
    bookmark.user_id = this._id;
    return bookmark;
};
/**
 * removeBookmark( bookmark ) - Delete a bookmark from the user's collection.
 * --------------------------------------------------------------------------
 *
 * Example:
 *
 *     // Get the logged-in user.
 *     var user = req.user;
 *     user.deleteBookmark(req.bookmark, function(err) {
 *         if (err) { return next(err); };
 *         res.redirect('/');
 *     });
 */
User.methods.removeBookmark = function(bookmark, callback) {
    Bookmark.findOneAndRemove({
        _id: bookmark._id,
        user_id: this._id
    }, callback);
};

// Export the User model
module.exports = mongoose.model('user', User);