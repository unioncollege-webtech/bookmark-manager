/**
 * bookmarklet.js
 * ==============
 * Export a function suitable to be used as a bookmarklet which bookmarks the
 * current page.
 *
 * This function will be stringified and encoded prior to being included on the
 * page.
 *
 * Note: Since this will be stuffed in an href attribute, let's be a bit more
 *   concise than usual.
 */
module.exports = function(d, url, title, desc, data, xhr) {
    d = document, url = d.location, title = d.title, xhr = new XMLHttpRequest(),
        desc = d.querySelector('meta[name="description"]') || d.querySelector('meta[property="og:description"]'),
        desc = desc ? desc.getAttribute('content') : '',
        data = 'url=' + encodeURIComponent(url) + '&title=' + encodeURIComponent(title) + '&description=' + encodeURIComponent(desc);
    xhr.onload = function() {
        if (this.status == 200) {
            alert('Bookmark saved successfully!');
        }
    };
    xhr.open('POST', '//{{settings.hostname}}/bookmarks/add');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(data);
};