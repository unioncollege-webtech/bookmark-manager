var bookmarks = [{
    "id" : 1,
    "url" : "https://www.atlassian.com/git/tutorial/git-basics",
    "title" : "Atlassian's Git Tutorial",
    "created" : "Thu Sep 04 2014 15:35:17 GMT-0500 (CDT)",
    "description" : "The Git Basics tutorial provides a succinct overview of the most important Git commands."
} , {
    "id" : 2,
    "url" : "http://git-scm.com/book",
    "title" : "Git Book",
    "created" : "Thu Sep 04 2014 15:35:17 GMT-0500 (CDT)",
    "description" : "The entire Pro Git book, written by Scott Chacon and published by Apress, is available to read here."
} , {
    "id" : 3,
    "url" : "https://help.github.com/articles/markdown-basics",
    "title" : "Github Help: Markdown Basics",
    "created" : "Thu Sep 04 2014 15:35:17 GMT-0500 (CDT)",
    "description" : "Markdown allows you to write using an easy-to-read, easy-to-write plain text format, which then converts to valid HTML for viewing on GitHub."
} , {
    "id" : 4,
    "url" : "http://json.org",
    "title" : "JSON Introduction",
    "created" : "Thu Sep 04 2014 15:35:17 GMT-0500 (CDT)",
    "description" : "JSON (JavaScript Object Notation) is a lightweight data-interchange format based on a subset of the JavaScript Programming Language. It's easy for humans to read and write, and easy for machines to parse and generate."
} , {
    "id" : 5,
    "url" : "http://github.com",
    "title" : "Github: Build software better, together.",
    "created" : "Thu Sep 04 2014 15:35:17 GMT-0500 (CDT)",
    "description" : "Github is a powerful collaboration, code review, and code management for open source and private projects. "
} , {
    "id" : 6,
    "url" : "http://contribute.jquery.org/style-guide/js/",
    "title" : "jQuery Project's JavaScript Style Guide",
    "created" : "Thu Sep 04 2014 15:35:17 GMT-0500 (CDT)",
    "description" : "In general, the jQuery style guide encourages liberal spacing for improved human readability."
} , {
    "id" : 7,
    "url" : "http://superherojs.com/",
    "title" : "Superhero.js",
    "created" : "Thu Sep 04 2014 15:35:17 GMT-0500 (CDT)",
    "description" : "Creating, testing and maintaining a large JavaScript code base is not easy — especially since great resources on how to do this are hard to find. Superhero.js is a collection of the best articles, videos and presentations on the topic."
} , {
    "id" : 8,
    "url" : "http://www.codethinked.com/preparing-yourself-for-modern-javascript-development",
    "title" : "Preparing Yourself for Modern JavaScript Development",
    "created" : "Thu Sep 04 2014 15:35:17 GMT-0500 (CDT)",
    "description" : "This post is an attempt to address some of the key concepts new developers should understand before tackling a large JavaScript project."
} , {
    "id" : 9,
    "url" : "http://uptodate.frontendrescue.org/",
    "title" : "How to keep up to date on front-end technologies",
    "created" : "Thu Sep 04 2014 15:35:17 GMT-0500 (CDT)",
    "description" : "The web is a rapidly evolving universe, and it's difficult to keep up. This is a recipe for staying up to date on the tools, trends, workflows, and technology used for modern web development."
} , {
    "id" : 10,
    "url" : "http://c9.io",
    "title" : "Cloud9 IDE",
    "created" : "Thu Sep 04 2014 15:35:17 GMT-0500 (CDT)",
    "description" : "Cloud9 combines a powerful online code editor with a full Ubuntu workspace in the cloud"
}];









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

    linkElement.appendChild( document.createTextNode( bookmark.title ) );
    linkElement.className = 'bookmark-link';
    linkElement.url = bookmark.url;
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
    html += '<h1><a class="bookmark" href="';
    html += bookmark.url;
    html += '" title="';
    html += bookmark.title;
    html += '">';
    html += bookmark.title;
    html += '</a></h1>';

    if ( bookmark.description ) {
        html += '<p class="description">';
        html += bookmark.description;
        html +='</p>';
    }
    html += '</article>';

    return html;
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

// Grab the template from the page and compile it.
var templateSource = document.getElementById('bookmark-template').innerHTML;
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

//renderBookmarkElements(bookmarks);
//renderBookmarksAsHTML(bookmarks);
renderBookmarksWithTemplate(bookmarks);
