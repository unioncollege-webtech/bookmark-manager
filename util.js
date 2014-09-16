/**
 * getJSON( path, callback )
 * -------------------------
 * Asynchronously fetch and parse a JSON file.
 *
 * - path:             A String specifying the location of the JSON file.
 * - callback( data ): A Function to be executed when the JSON file is retrieved
 *                     and parsed. The function will be passed the parsed json
 *                     data.
 *
 * Example:
 * 
 *     getJSON('bookmarks.json', function( data ) {
 *         console.log( data );
 *     });
 * 
 * Returns undefined.
 */
function getJSON(path, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("get", path, true);
    xhr.onload = function() {
        var data = JSON.parse( this.responseText );
        callback( data );
    };
    xhr.send();
}

/**
 * getJSONP( path )
 * ----------------
 * Asynchronously load a JSONP file.
 *
 * - path: A String specifying the location of the JSONP file.
 *
 * Example:
 * 
 *     getJSONP('bookmarks.js');
 * 
 * Returns undefined.
 */
function getJSONP(path) {
    var script = document.createElement('script');
    script.src = path;
    document.body.appendChild(script);
}