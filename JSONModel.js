var fs = require('fs');

/**
 * Create a new model based on the data in the .JSON file.
 */
function JSONModel(filePath) {
    this.path = filePath;
    this.data = require(this.path);
}
JSONModel.prototype = {
    /**
     * Return the underlying data for this collection.
     */
    all: function() {
        return this.data;
    },
    /**
     * Return a new array containing the items filtered by the passed filter
     * function.
     */
    find: function(filter) {
        return this.data.filter(filter);
    },
    /**
     * Return an item whose 'id' property matches, or null if the item does
     * not exist in the collection.
     */
    findById: function(id) {
        if (typeof id === 'undefined') {
            return null;
        }
        else {
            return this.find(function(item) {
                return item.id == id;
            })[0];
        }
    },
    /**
     * Save an item into the collection.
     */
    save: function(item, callback) {
        var existing = this.findById(item.id);
        if (!existing) {
            item.id = this._nextId();
            item.created = Date();
            this.data.push(item);
        }
        else {
            Object.getOwnPropertyNames(item).forEach(function(key) {
                existing[key] = item[key];
            });
        }
        this._write(function(err) {
            callback(err, item);
        });
    },
    /**
     * Remove an item from the collection
     */
    remove: function(item, callback) {
        var removeIndex = null;
        this.data.forEach(function(data, index) {
            if (data.id == item.id) {
                removeIndex = index;
            }
        });
        if (removeIndex > -1) {
            this.data.splice(removeIndex, 1);
        }
        this._write(function(err) {
            callback(err, item);
        });
    },
    /**
     * Private: Generate a unique identifier.
     */
    _nextId: function() {
        var maxId = this.data.map(function(bookmark) {
            return bookmark.id;
        }).reduce(function(prev, next) {
            return Math.max(prev, next);
        });
        return maxId + 1;
    },
    /**
     * Write the JSON data out to a file.
     */
    _write: function(callback) {
        var file = fs.createWriteStream(this.path);
        var json = JSON.stringify(this.data, null, 4);
        file.write(json, 'utf8', callback);
    }
};

module.exports = JSONModel;