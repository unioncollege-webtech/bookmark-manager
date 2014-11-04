var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Bookmark = require('./Bookmark'),
    slugify = require('slugify');

// Define the schema for a bookmark collection.
var schema = new Schema({
    /**
     * name - A String containing the user-chosen, human-readable name for this
     *        collection.
     */
    name: {
        type: String,
        required: true
    },
    /**
     * description - A String providing a more complete description of the
     *               collection (optional).
     */
    description: String,
    /**
     * path - A String uniquely identifying the collection in a manner suitable
     *        for use as a URL path.
     */
    path: {
        type: String,
    },
    /**
     * user_id - The _id associated with the owner of this collection.
     */
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
});

schema.index({
    user_id: 1,
    path: 1
}, {
    unique: true
});

schema.methods.findBookmarks = function(callback) {
    var query = Bookmark.find({
        user_id: this.user_id,
        collections: this.path
    });

    if (callback) {
        return query.exec(callback);
    }
    else {
        return query;
    }
};

// Generate the `path` property before save.
schema.pre('save', function(next) {
    var collection = this;

    // Do not overwrite the existing path.
    if (!collection.path) {
        var path = slugify(collection.name).toLowerCase();
        // TODO: Ensure that the path is unique before saving.
        collection.path = path;
    }
    next();
});

var Collection = mongoose.model('collection', schema);
module.exports = Collection;