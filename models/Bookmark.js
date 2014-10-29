var mongoose = require('mongoose');
var url = require('url');

// Define the schema for a bookmark
var schema = mongoose.Schema({
    /**
     * href - A String containing the full (original) hyperlink reference as a URL.
     */
    href: {
        type: String,
        required: true
    },
    /**
     * title - A String representing a brief, human-readable title for the
     *         bookmark.
     */
    title: {
        type: String,
        required: true
    },
    /**
     * description - A String providing a more complete description of the
     *               bookmarked item (optional).
     */
    description: String,
    /**
     * url - The URL represented as an object.
     */
    url: {
        /**
         * href - The full URL that was originally parsed. Both the protocol and
         *       host are lowercased.
         *
         *         Example: 'http://user:pass@host.com:8080/p/a/t/h?query=string#hash'
         */
        href: String,
        /**
         * protocol - The request protocol, lowercased.
         *
         *             Example: 'http:'
         */
        protocol: String,
        /**
         * auth - The authentication information portion of a URL.
         *
         *         Example: 'user:pass'
         */
        auth: String,
        /**
         * hostname - Just the lowercased hostname portion of the host.
         *
         *             Example: 'host.com'
         */
        hostname: String,
        /**
         * port - The port number portion of the host.
         *
         *         Example: '8080'
         */
        port: String,
        /**
         * pathname - The path section of the URL, that comes after the host and
         *             before the query, including the initial slash if present.
         *
         *             Example: '/p/a/t/h'
         */
        pathname: String,
        /**
         * search - The 'query string' portion of the URL, including the leading
         *           question mark.
         *
         *           Example: '?query=string'
         */
        search: String,
        /**
         * hash - The 'fragment' portion of the URL including the pound-sign.
         *
         *         Example: '#hash'
         */
        hash: String
    },
    /**
     * created - The Date and time that the bookmark was created.
     */
    created: {
        type: Date,
        default: Date.now
    },
    /**
     * user_id - The _id of the user who created this bookmark.
     */
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    }
});

/**
 * create_date - The `created` property represented as a formatted String.
 */
schema.virtual('create_date').get(function() {
    return this.created.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
});

// Expose virtual properties when toObject is called.
schema.set('toObject', {
    getters: true,
    virtuals: true
});

// Pre-parse the href and store the URL object
schema.pre('save', function(next) {
    var bookmark = this;
    if (!bookmark.url || bookmark.url.href !== bookmark.href) {
        try {
            var parsed = url.parse(bookmark.href);
            bookmark.url = {
                href: parsed.href || '',
                protocol: parsed.protocol || '',
                auth: parsed.auth || '',
                hostname: parsed.hostname || '',
                port: parsed.port || '',
                pathname: parsed.pathname || '',
                search: parsed.search || '',
                hash: parsed.hash || ''
            };
            return next();
        }
        catch (e) {
            console.warn("Caught error parsing url %s: %s", bookmark.href, e);
            return next(e);
        }
    }
    next();
});

/**
 * findForUser( user, callback ) - Find the bookmarks associated with a user.
 * ==========================================================================
 * Bookmark.findForUser() returns the bookmarks associated with the passed user.
 *
 * Similar to Bookmark.find(), this method will execute the query and pass the
 * results to `callback` if callback is provided. If a callback function is not
 * provided, `.findForUser` will return a query builder allowing you to add
 * additional search constraints, sort, or run distinct() commands.
 *
 * The method takes the following arguments:
 *
 * - user:     The User to retrieve bookmarks for. The user must have an _id property.
 * - callback: (Optional) A Function to pass the query results to. If `callback`
 *               is not passed, a query builder is returned.
 *
 * Example:
 *
 *     // Search for and render all the bookmarks for a user.
 *     Bookmark.findForUser( req.user, function(err, bookmarks) {
 *         if(err) {
 *            return next(err);
 *         }
 *         res.render('index', {
 *             title: 'Bookmarks',
 *             bookmarks: bookmarks,
 *         })
 *     });
 *
 *     // Find a bookmark by id
 *     Bookmark.findForUser( req.user )
 *             .findOne({_id: id})
 *             .exec(function(err, bookmark) {
 *         if(err) {
 *            return next(err);
 *         }
 *         if (!bookmark) {
 *             return res.status(404).send('Bookmark not found');
 *         }
 *
 *         res.render('bookmark', {
 *             title: 'Bookmark details',
 *             bookmark: bookmark,
 *         })
 *     });
 */
schema.statics.findForUser = function(user, callback) {
    return this.find({
        user_id: (user) ? user._id : null
    }, callback);
};

// Export the model
var Bookmark = mongoose.model('bookmark', schema);
module.exports = Bookmark;