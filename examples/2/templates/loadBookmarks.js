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
var bookmarkTemplate = Handlebars.compile( templateSource );

/**
 * createBookmarkFromTemplate( bookmark )
 * --------------------------------------
 * Create an String that contains the bookmark's properties encoded as HTML.
 *
 * - bookmark: An Object containing the bookmark's properties.
 *
 * Returns an String containing the bookmark's HTML.
 */
function createBookmarkFromTemplate( bookmark ) {
    return bookmarkTemplate( bookmark );
}

/**
 * renderBookmarksWithTemplate( bookmarks )
 * ----------------------------------------
 * Render the bookmarks as HTML, using the Handlebars template.
 * - bookmarks: An Array of objects that contain the bookmark's properties.
 *
 * Returns undefined.
 */
function renderBookmarksWithTemplate( bookmarks ) {
    var container = document.querySelector('.bookmark-container');

    bookmarks.map( createBookmarkFromTemplate ).forEach(function( bookmarkHTML ){
        container.innerHTML += bookmarkHTML;
    });
 }


// Above, we defined the following functions to render the bookmarks. We now
// need to execute that function.

// The 'bookmarks' property is defined in bookmarks.js, which is included on
// the page before this file.
renderBookmarksWithTemplate( window.bookmarks );