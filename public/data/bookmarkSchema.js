/**
 * Bookmark Schema
 * ---------------
 * This is a rough representation of the data we are storing for each bookmark.
 *
 * The Bookmark is the atomic unit of the bookmarking service. Users create
 * multiple bookmarks to keep track of interesting web sites, pages, or even
 * videos, books, or movies.
 *
 * A Bookmark is primarily a URL with some associated metadata.
 */
var BookmarkSchema = {
    /**
     * id - A Number to serve as a system-generated unique identifier
     */
    id: Number,

    /**
     * url - A String containing the URL of the bookmarked item.
     */
    url: String,

    /**
     * title - A String representing a brief, human-readable title for the
     *         bookmark.
     */
    title: String,

    /**
     * created - The Date and time that the bookmark was created.
     */
    created: Date,

    /**
     * description - A String providing a more complete description of the
     *               bookmarked item (optional).
     */
    description: String,

    /**
     * type - We may eventually want to identify the type of content that the
     *        bookmark represents, such as text, video, image, document, etc.
     *
     * type : String
     */
};