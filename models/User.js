var mongoose = require('mongoose');

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

// Export the User model
module.exports = mongoose.model('user', User);