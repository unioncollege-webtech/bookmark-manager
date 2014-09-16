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
 *
 * Note: This is currently just an alias to `renderBookmarksWithTemplate`.
 */
window.renderBookmarks = renderBookmarksWithTemplate;


// Load our bookmarks using XMLHttpRequest:
//getJSON('bookmarks.js', renderBookmarks);

// Load our bookmarks as JSONP:
getJSONP('bookmarks.js');
