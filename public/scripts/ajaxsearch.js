/**
 * ajaxsearch.js - Ajaxify the advanced search.
 * ============================================
 * Post JSONP queries to the server when the user changes values in the input
 * fields, and render the results to the search-results container.
 */
(function initAjaxSearch() {
    // Find the bookmark elements
    var results = document.querySelector('.search-results');
    var keyword = document.querySelector('.ajaxsearch input[name="q"]');
    var hostname = document.querySelector('.ajaxsearch input[name="hostname"]');
    var lastQuery = '';

    var execSearch = function() {
        var q = encodeURIComponent(this.value);
        var hn = encodeURIComponent(hostname.value);
        var query = '/search?q=' + q + '&hostname=' + hn + '&format=jsonp&callback=renderResults';

        if (query !== lastQuery) {
            lastQuery = query;
            getJSONP(query);
        }
    };

    if (results && keyword && hostname) {
        // Filter the items on every key press
        keyword.onkeyup = hostname.onkeyup = execSearch;
    }

    window.renderResults = function(res) {
        results.innerHTML = Handlebars.templates.bookmark_list(res);
    };
})();