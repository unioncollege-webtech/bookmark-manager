Bookmark Manager
-------------------
Bookmark Manager is a simple bookmarking service to help you keep track of your favorite places on the web. It provides a simple listing of bookmarks, and will someday include the capability to search, sort, tag, favorite, and share a collection of links.

Each bookmark has the following properties:

- _id - A system-generated unique identifier
- href - A String containing the URL of the bookmarked item
- title - A String containing a brief summary of the linked document
- description - A String containing a plain-text description of the item
- created - A Date representing the date and time the user created the bookmark

## Model

The Bookmark model is specified using a [Mongoose schema](http://mongoosejs.com/docs/guide.html):

```js
var schema = mongoose.Schema({
    href: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    created: {
        type: Date,
        default: Date.now
    }
});

var Bookmark = mongoose.model('bookmark', schema);
module.exports = Bookmark;
```

See the full implementation in [models/Bookmark.js](models/Bookmark.js)

## License
ISC
