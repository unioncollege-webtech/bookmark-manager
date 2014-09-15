// Generating HTML using the Document Object Model
// ===============================================
// The first approach we're going to take is to define a function that
// transforms our data into a tree of HTML elements. We'll be using the Document
// Object Model, which provides a programmatic interface to an HTML document.
// With DOM methods, we can dynamically create elements from JavaScript and
// add them to the page.

/**
 * createBookmarkElement( bookmark )
 * ---------------------------------
 * Create a DOM element from the bookmark's properties.
 *
 * - bookmark: An Object containing the bookmark's properties.
 *
 * Returns an HTMLElement that contains the bookmark represented as HTML.
 */
function createBookmarkElement(bookmark) {
    // Per the specification, the `article` element represents a complete or
    // self-contained piece of content that's independently distributable.
    // It makes a good root element for the bookmark content.
    var bookmarkElement = document.createElement('article');
    bookmarkElement.className = 'bookmark';

    var titleElement = document.createElement('h1');
    var linkElement = document.createElement('a');
    var linkText = document.createTextNode(bookmark.title);

    linkElement.appendChild(linkText);
    linkElement.className = 'bookmark-link';
    linkElement.href = bookmark.url;
    linkElement.title = bookmark.title;

    titleElement.appendChild(linkElement);
    bookmarkElement.appendChild(titleElement);

    // The description is optional, so make sure our bookmark has one.
    if (bookmark.description) {
        var descElement = document.createElement('p');
        descElement.appendChild(document.createTextNode(bookmark.description));
        descElement.className = 'bookmark-description';

        bookmarkElement.appendChild(descElement);
    }

    return bookmarkElement;
}

/**
 * renderBookmarkElements( bookmarks )
 * ----------------------------
 * Render the bookmark elements on the page.
 *
 * - bookmarks: An Array of objects that contain the bookmark's properties.
 *
 * Returns undefined.
 */
function renderBookmarkElements(bookmarks) {
    var container = document.querySelector('.bookmark-container');

    bookmarks.map(createBookmarkElement).forEach(function(bookmarkElement) {
        container.appendChild(bookmarkElement);
    });
}




// Using a Template Engine
// =======================
// A third way to generate HTML from our JavaScript objects is to use a template
// engine such as Mustache or Handlebars. Templates allow us to define the
// structure of our HTML in a way that looks very close to the final rendered
// HTML. The template engine is then responsible for merging the template and
// the JavaScript content.

// Template source is in a <script> element with the id=bookmark-template
var templateSource = document.getElementById('bookmark-template').innerHTML;

// The handlebars.js library must be loaded before this JavaScript file so we
// can use it to compile our template. The compiled template (bookmarkTemplate)
// is a function that takes a context object (a bookmark) and returns the
// generated HTML.
var bookmarkTemplate = Handlebars.compile(templateSource);

/**
 * createBookmarkFromTemplate( bookmark )
 * --------------------------------------
 * Create an String that contains the bookmark's properties encoded as HTML.
 *
 * - bookmark: An Object containing the bookmark's properties.
 *
 * Returns an String containing the bookmark's HTML.
 */
function createBookmarkFromTemplate(bookmark) {
    return bookmarkTemplate(bookmark);
}

/**
 * renderBookmarksWithTemplate( bookmarks )
 * ----------------------------------------
 * Render the bookmarks as HTML, using the Handlebars template.
 *
 * - bookmarks: An Array of objects that contain the bookmark's properties.
 *
 * Returns undefined.
 */
function renderBookmarksWithTemplate(bookmarks) {
    var container = document.querySelector('.bookmark-container');

    bookmarks.map(createBookmarkFromTemplate).forEach(function(bookmarkHTML) {
        container.innerHTML += bookmarkHTML;
    });
}


/**
 * renderBookmarks( bookmarks )
 * ----------------------------
 * Render the passed bookmarks to the page.
 *
 * - bookmarks: An Array of objects that contain the bookmark's properties.
 */
window.renderBookmarks = renderBookmarksWithTemplate;

/**
 * getJSON
 * -------
 * Asynchronously fetch a JSON file and parse it.
 *
 * - path:             A String specifying the location of the JSON file.
 * - callback( json ): A Function to be executed when the JSON file is retrieved
 *                     and parsed. The function will be passed the parsed json
 *                     data.
 *
 * Returns undefined.
 */
function getJSON(path, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("get", path, true);
    xhr.onload = function() {
        callback.call(this, JSON.parse(this.responseText));
    };
    xhr.send();
}


// Fetch the bookmarks as JSON data and render them.
//getJSON("bookmarks.json", renderBookmarks);


/**
 * getJSONP
 * --------
 * Asynchronously load a JSONP file.
 *
 * - path: A String specifying the location of the JSONP file.
 *
 * Returns undefined.
 */
function getJSONP(path) {
    var script = document.createElement('script');
    script.src = path;
    document.body.appendChild(script);
}

getJSONP('bookmarks.js');


/**
 * getURLParameters
 * ----------------
 * Returns an Object containing the parameters in the URL as key/value pairs. If
 * a URL parameter does not have a value, it's given the boolean value `true`.
 *
 * If there are no URL parameters, an empty object is returned.
 */
function getURLParameters() {
    // The `search` property on document.location contains the portion of the
    // URL containing query parameters in the form of:
    // '?key1=value1&key2&key3=value3'.
    return document.location.search
        // Remove the preceding question mark.
        .replace(/^\?/, '')
        // The keys are separated by an ampersand '&'.
        .split('&')
        // The key/value pairs are separated by an '='.
        .map(function(query) {
            return query.split('=');
        })
        // Build a JavaScript object containing the key/value pairs.
        .reduce(function(params, pair) {
            var key = pair[0];
            var value = pair[1];
            if (key) {
                if (typeof(value) !== 'undefined') {
                    params[key] = value;
                }
                else {
                    params[key] = true;
                }
            }
            return params;
        }, {});
}

/**
 * renderBookmarksConsideringId
 * ----------------------------
 * Render the passed bookmarks to the page, but consider the `id` parameter in
 * the URL.
 *
 * - bookmarks: An Array of objects that contain the bookmark's properties.
 */
function renderBookmarksConsideringId(bookmarks) {
    var id = getURLParameters().id;

    if (id) {
        bookmarks = bookmarks.filter(function(bookmark) {
            return bookmark.id == id;
        });
    }
    renderBookmarksWithTemplate(bookmarks);
}

// Override the renderBookmarks with ours that considers the ID parameter.
window.renderBookmarks = renderBookmarksConsideringId;