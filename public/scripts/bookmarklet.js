module.exports = function() {
    var d = document,
        url = d.location,
        title = d.title,
        description = d.querySelector('meta[name="description"]') || d.querySelector('meta[property="og:description"]');
    if (description) {
        description = description.getAttribute('content')
    }
    var data = 'url=' + encodeURIComponent(url) + '&title=' + encodeURIComponent(title) + '&description=' + encodeURIComponent(description),
        xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (this.status == 200) {
            alert('Bookmark saved successfully!');
        }
    };
    xhr.open('POST', 'https://webtech-c9-barberboy.c9.io/bookmarks/add');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(data);
};