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


    var bookmarks = [].slice.call(document.querySelectorAll('.bookmark-container > .bookmark'));
    var searchbox = document.querySelector('.search input');

    if (searchbox) {
        searchbox.onkeyup = function() {
            var value = this.value;
            bookmarks
                .map(show)
                .filter(function(item) {
                    return item.textContent.toLowerCase().indexOf(value.toLowerCase()) === -1;
                })
                .forEach(hide);
        };
    }
})();