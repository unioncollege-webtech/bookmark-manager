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

/**
 * renderBookmarksWithTemplate( bookmarks )
 * ----------------------------------------
 * Render the bookmarks as HTML, using the Handlebars template.
 *
 * - bookmarks: An Array of objects that contain the bookmark's properties.
 *
 * Requires handlebars.runtime.js, templates.js
 *
 * Returns undefined.
 */
function renderBookmarksWithTemplate(bookmarks) {
    var container = document.querySelector('.bookmark-container');

    // `Handlebars.templates.bookmark` has been precompiled from the
    // 'bookmark.handlebars' source file and is defined in 'templates.js'.
    bookmarks.map(Handlebars.templates.bookmark).forEach(function(bookmarkHTML) {
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
 * Required By: bookmarks.js
 *
 * Note: This is currently just an alias to `renderBookmarksWithTemplate`.
 */
window.renderBookmarks = renderBookmarksWithTemplate;

/**
 * init()
 * ------
 * Initialize our application.
 *
 * Requires #renderBookmarks
 * Requires util.js#getJSONP
 *
 * Returns undefined.
 */
function init() {
    // Load our bookmarks using XMLHttpRequest:
    //getJSON('bookmarks.js', renderBookmarks);

    // Load our bookmarks as JSONP:
    getJSONP('/data/bookmarks.js');
}

// Initialize our application
init();