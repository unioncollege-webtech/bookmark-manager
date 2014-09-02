Introduction
------------

Greetings, developers! We're setting out on an exploration of the technologies that power the world wide web. We have grand ambitions to master HTML, JavaScript, & CSS, and to learn the fundamentals necessary to create powerful, scalable web applications using some common web frameworks.

Our reference application will be a social bookmarking service that will allow people to keep track of the interesting web sites, articles, videos, images, and books that they run across on the web.

<!--TODO: Provide overview and screenshots of the completed application once it's completed -->

Project Description
-------------------
The project is a simple, social bookmarking service that allows users to keep track of their favorite places on the web. It provides a simple and beautiful listing of bookmarks, and provides the capability to search, sort, tag, favorite, and share their collection of links.

Each bookmark has the following properties:

- id - A String representing the system-generated unique identifier
- url - A String containing the URL of the bookmarked item
- created - A Date representing the date and time the user created the bookmark
- description - A String containing a plain-text description of the item

Possible future properties:

- snippet - A String of HTML containing a quote or brief snippet of the item
- thumbnail - A String containing a reference to a small preview image of the item
- archive - A String containing a reference to a permanently archived version of the item.

Approach
--------
We will be building this bookmarking system from the ground up in several stages:

1. A simple, static HTML mockup
2. Separating Data from HTML
3. Storing Data using LocalStorage
4. Implementing Create, Read, Update, Delete
5. Using Handlebars to render the data
6. Storing Data on the Server using Node.js
6. Using a Database for data storage
7. Adding Routes for viewing, searching, sharing
8. Adding user authentication
9. Multi-user support
10. Implementing an API
11. Creating multiple API clients
12. Optimizing for performance

Homework 1 — Create a New Project
---------------------------------

1. Create a new c9.io workspace for your individual project.
2. Initialize a new Git repository for your project.
3. Create a README.md file that provides a brief description of your project.
4. Define the 'atomic unit' for your project, and model it using a simple schema. See `bookmarkSchema.js` as a reference.
5. Define (approximately) the HTML representation for your data model. See `bookmarkTemplate.html` as a reference.
6. Create an index.html that lists out a few examples of your data.
7. Add and commit your README.md, index.html, schema.js, and template.html files.
