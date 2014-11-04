var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
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

schema.index({ user_id: 1, path: 1 }, { unique: true });

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