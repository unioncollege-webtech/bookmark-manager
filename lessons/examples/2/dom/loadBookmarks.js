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
function createBookmarkElement( bookmark ) {
    // Per the specification, the `article` element represents a complete or
    // self-contained piece of content that's independently distributable.
    // It makes a good root element for the bookmark content.
    var bookmarkElement = document.createElement('article');
    bookmarkElement.className = 'bookmark';

    var titleElement = document.createElement('h1');
    var linkElement = document.createElement('a');
    var linkText = document.createTextNode( bookmark.title );

    linkElement.appendChild( linkText );
    linkElement.className = 'bookmark-link';
    linkElement.href = bookmark.url;
    linkElement.title = bookmark.title;

    titleElement.appendChild( linkElement );
    bookmarkElement.appendChild( titleElement );

    // The description is optional, so make sure our bookmark has one.
    if ( bookmark.description ) {
        var descElement = document.createElement('p');
        descElement.appendChild( document.createTextNode( bookmark.description ) );
        descElement.className = 'bookmark-description';

        bookmarkElement.appendChild( descElement );
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
function renderBookmarkElements( bookmarks ) {
    var container = document.querySelector('.bookmark-container');

    bookmarks.map( createBookmarkElement ).forEach(function( bookmarkElement ){
        container.appendChild( bookmarkElement );
    });
}


// Above, we defined the following functions to render the bookmarks. We now
// need to execute that function, passing in the bookmarks to render.

// The 'bookmarks' property is defined in bookmarks.js, which is included on
// the page before this file.
renderBookmarkElements( window.bookmarks );