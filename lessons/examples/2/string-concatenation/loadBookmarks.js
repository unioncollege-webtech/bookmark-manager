// Generating HTML Strings
// =======================
// One potential downside to using DOM methods to generate HTML is the verbosity
// of the DOM APIs. If we have a lot of elements to create, the code can become
// a bit tedious. A different approach is simply to build up the HTML as a
// string, and return the HTML string.

/**
 * createBookmarkHTML( bookmark )
 * ------------------------------
 * Create an String that contains the bookmark's properties encoded as HTML.
 *
 * - bookmark: An Object containing the bookmark's properties.
 *
 * Returns an String containing the bookmark's HTML.
 */
function createBookmarkHTML( bookmark ) {
    var html = '';
    html += '<article class="bookmark">';
    html +=   '<h1>';
    html +=     '<a class="bookmark"';
    html +=       ' href="' + bookmark.url + '"';
    html +=       ' title="' + bookmark.title + '"';
    html +=     '>';
    html +=     bookmark.title;
    html +=     '</a>';
    html +=   '</h1>';

    if ( bookmark.description ) {
        html += '<p class="description">';
        html +=   bookmark.description;
        html +='</p>';
    }
    html += '</article>';

    return html;
}

/**
 * renderBookmarksAsHTML( bookmarks )
 * ----------------------------
 * Render the bookmarks on the page as HTML.
 *
 * - bookmarks: An Array of objects that contain the bookmark's properties.
 *
 * Returns undefined.
 */
function renderBookmarksAsHTML( bookmarks ) {
    var container = document.querySelector('.bookmark-container');

    bookmarks.map( createBookmarkHTML ).forEach(function( bookmarkHTML ){
        container.innerHTML += bookmarkHTML;
    });
}



// Above, we defined the following functions to render the bookmarks. Now we
// run the function, passing in the bookmarks to render.

// The 'bookmarks' property is defined in bookmarks.js, which is included on
// the page before this file.
renderBookmarksAsHTML( window.bookmarks );