(function initSearch() {
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
    var searchbox = document.querySelector('.search input');

    if (searchbox) {
        // Filter the items on every key press
        searchbox.onkeyup = function() {
            var value = this.value;
            bookmarks
                .map(show)
                .filter(function(item) {
                    // Find the items that *don't* match the search text.
                    return item.textContent.toLowerCase().indexOf(value.toLowerCase()) === -1;
                })
                .forEach(hide);
        };
    }
})();