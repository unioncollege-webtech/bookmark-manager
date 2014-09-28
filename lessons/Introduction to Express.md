Introduction to Express
=======================
Express is a web application framework for Node.js, providing a solid foundation for building single and multi-page web applications. It provides a small core of functionality and a pluggable "middleware" system that enables you to build feature-rich web applications using JavaScript and Node.js.

This introduction to Express is going to cover Express 4.0, which has some significant [differences from 3.0].

## Installing Express

    npm install express

## Creating an Express server

    var express = require('express');
    var app = express();
    app.listen(port, ip);

## Middleware

    app.use(function(req, res, next){})

## Request object

## Response object

## Routes

    app.get(function(req, res){

    });

## Serving Static files

    app.use(express.static(__dirname + '/public'));

## Views and Layouts

- Setting up Handlebars
- 'views' directory
- Layouts

    res.render('layout', {});

    app.locals

## Dynamic data

    req.query
    req.params
    req.body
    req.param
    req.cookies

## Common Middlware

- [body-parser](https://github.com/expressjs/body-parser)
- [cookie-parser](https://github.com/expressjs/cookie-parser)
- [session](https://github.com/expressjs/session)
- [serve-index](https://github.com/expressjs/serve-index)
- [compression](https://github.com/expressjs/compression)
- [passport](https://github.com/jaredhanson/passport)

## Error Handling


[Differences from 3.0]: http://expressjs.com/migrating-4.html