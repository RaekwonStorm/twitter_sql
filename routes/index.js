'use strict';
var express = require('express');
var router = express.Router();
var tweetBank = require('../tweetBank');

module.exports = function makeRouterWithSockets (io, client) {

  // a reusable function
  function respondWithAllTweets (req, res, next){
      client.query('SELECT * FROM tweets INNER JOIN users ON userid = users.id', function (err, result) {
      if (err) return next(err); // pass errors to Express
      var tweets = result.rows;
      res.render('index', { title: 'Twitter.js', tweets: tweets, showForm: true });
    });
  }

  // CREATE USER HELPER FUNCTION


  // here we basically treet the root view and tweets view as identical
  router.get('/', respondWithAllTweets);
  router.get('/tweets', respondWithAllTweets);

  // single-user page
  router.get('/users/:username', function(req, res, next){
    client.query('SELECT * FROM tweets INNER JOIN users ON userid = users.id WHERE name=$1',[req.params.username], function (err, result) {
      if (err) return next(err); // pass errors to Express
      var tweets = result.rows;
      res.render('index', { title: 'Twitter.js', tweets: tweets, showForm: true });
    });
  });

  // single-tweet page
  router.get('/tweets/:id', function(req, res, next){
    client.query('SELECT * FROM tweets INNER JOIN users ON userid = users.id WHERE tweets.id=$1',[req.params.id], function (err, result) {
      if (err) return next(err); // pass errors to Express
      var tweets = result.rows;
      res.render('index', { title: 'Twitter.js', tweets: tweets, showForm: true });
    });
  });

  // create a new tweet
  router.post('/tweets', function(req, res, next){
    client.query('INSERT INTO users (name, pictureUrl) VALUES ($1, $2)', [req.body.name, 'http://i.imgur.com/CTil4ns.jpg'], function(err, data) {
      if (err) return next(err);
      var idQuery = client.query('SELECT id FROM users WHERE name=$1', [req.body.name], function(err, data) {
        if (err) return next (err);
        console.log(data.rows);
      });

      // client.query('INSERT INTO tweets (userId, content) VALUES ($1, $2)', [idQuery, req.body.content], function (err, data) {
      //   if (err) return next(err);
      //   var newTweet = data.rows;
      //   io.sockets.emit('new_tweet', newTweet);
      //   res.redirect('/');
      // });
    });
  });



  //   // create variable to capture userName
  //   var userName = req.body.name;
  //   // check if userName associated with a userId
  //   client.query('SELECT * FROM tweets INNER JOIN users ON userid = users.id WHERE EXISTS (name=$1)',[userName], function (err, result) {
  //     if (err) return next(err); // pass errors to Express
  //     if (result )
  //   // if yes, run normal code based on userId
  //   // else, create new userId

  //   client.query('INSERT INTO tweets (userId, content) VALUES ($1, $2)', [req.body.name, req.body.content], function (err, data) {
  //     if (err) return next(err);
  //     var newTweet = data.rows;
  //     io.sockets.emit('new_tweet', newTweet);
  //     res.redirect('/');
  //   });
  // });

  // // replaced this hard-coded route with general static routing in app.js
  // router.get('/stylesheets/style.css', function(req, res, next){
  //   res.sendFile('/stylesheets/style.css', { root: __dirname + '/../public/' });
  // });

  return router;
}
