/**
 * ajaxsearch.js - Ajaxify the advanced search.
 * ============================================
 * Post JSONP queries to the server when the user changes values in the input
 * fields, and render the results to the search-results container.
 */
(function initAjaxSearch() {
    var keyword = document.querySelector('.ajaxsearch input[name="q"]');
    var hostname = document.querySelector('.ajaxsearch input[name="hostname"]');
    var results = document.querySelector('.search-results');
    var template = Handlebars.templates.bookmark_list;

    if (results && keyword && hostname) {
        // Filter the items on every key press
        keyword.onkeyup = hostname.onkeyup = function() {
            getJSONP('/search?q=' + encodeURIComponent(keyword.value) +
                '&hostname=' + encodeURIComponent(hostname.value) +
                '&format=jsonp&callback=renderResults');
        };

        window.renderResults = function(res) {
            results.innerHTML = template(res);
        };
    }
})();