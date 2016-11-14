var mongoose = require('mongoose');

// Define the schema for a bookmark
var schema = mongoose.Schema({
    /**
     * href - A String containing the full URL of the bookmarked page.
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
     * created - The Date and time that the bookmark was created.
     */
    created: {
        type: Date,
        default: Date.now
    }
});


// Export the model
var Bookmark = mongoose.model('bookmark', schema);
module.exports = Bookmark;
