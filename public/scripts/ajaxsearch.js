/**
 * ajaxsearch.js - Ajaxify the advanced search.
 * ============================================
 * Post JSONP queries to the server when the user changes values in the input
 * fields, and render the results to the search-results container.
 *
 * This requires that the following elements be on the page:
 *
 * - `.ajaxsearch input[name="q"]` — A text input containing the keyword query.
 * - `.ajaxsearch input[name="hostname"]` – A text input with the hosthame query.
 * - `.ajaxsearch-results` – A container for the search results.
 */
(function initAjaxSearch() {
    // Query for the necessary elements on the page.
    var keyword = document.querySelector('.ajaxsearch input[name="q"]');
    var hostname = document.querySelector('.ajaxsearch input[name="hostname"]');
    var results = document.querySelector('.ajaxsearch-results');

    if (results && keyword && hostname) {
        // Filter the items on every key press
        keyword.onkeyup = hostname.onkeyup = function() {
            getJSONP('/search?q=' + encodeURIComponent(keyword.value) +
                '&hostname=' + encodeURIComponent(hostname.value) +
                '&format=jsonp&callback=renderResults');
        };

        // Use the precompiled `bookmark_list` template to render the bookmarks
        var template = Handlebars.templates.bookmark_list;
        window.renderResults = function(res) {
            results.innerHTML = template(res);
        };
    }
})();