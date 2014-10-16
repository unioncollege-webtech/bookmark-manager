(function initQuickSearch() {
    // Show an element
    function show(element) {
        element.classList.remove('hide');
        return element;
    }

    // Hide an element
    function hide(element) {
        element.classList.add('hide');
        return element;
    }

    // Find the bookmark elements
    var bookmarks = [].slice.call(document.querySelectorAll('.bookmark-container > .bookmark'));
    var searchbox = document.querySelector('.quicksearch input');

    if (searchbox) {
        // Filter the items on every key press
        searchbox.onkeyup = function() {
            var value = this.value;
            bookmarks
                // Show everything,
                .map(show)
                // Find just the items that *don't* match the search text,
                .filter(function(item) {
                    return item.textContent.toLowerCase().indexOf(value.toLowerCase()) === -1;
                })
                // And hide them.
                .forEach(hide);
        };
    }
})();