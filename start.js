// Author: Nikhil Jha
// License: MIT

// Not the Onion?
// Can you tell if an article is from the Onion, or is it real?

// Init Dependencies
var TelegramBot = require('node-telegram-bot-api');
var FeedParser = require('feedparser')
  , request = require('request');
var jsonfile = require('jsonfile');
const fs = require('fs');

// Connect to Article DB
var options = {
  "host": "192.168.1.116",
}

var redis = require("redis"),
    client = redis.createClient(options);

client.on("error", function (err) {
    console.log("Error " + err);
});

// Connect to User DB
var levelup = require('levelup')
var db = levelup('./mydb')

// Initialize TelegramBot
var token = fs.readFileSync('telegram.token', 'utf-8');
token = token.split('\n')[0]
var bot = new TelegramBot(token, {polling: true});

// Matches /start
bot.onText(/\/start(.*)/, function (msg, match) {
  // Setup Keyboard
  var opts = {
      reply_markup: JSON.stringify({
        keyboard: [
          ['Onion'],
          ['Not the Onion']]
      })
    };

  // Send them a new one
  client.RANDOMKEY([], function (err, results) {
        var key = results;
        client.hget(key, "Title", function (err, resultt) {
            var title = resultt;
            client.hget(key, "Category", function (err, resultc) {
                var category = resultc;
                client.hget(key, "URL", function (err, resultu) {
                    var link = resultu;
                    var resp = title;
                    db.put(msg.from.id + 't', category, function (err) {
                      if (err) return console.log('Error!', err) // some kind of I/O error
                      bot.sendMessage(msg.from.id, resp, opts);
                    })
                });
            });
        });
  });
});

// Matches
bot.onText(/(Not the )?Onion/, function (msg, match) {
  // Setup keyboard
  var opts = {
      reply_markup: JSON.stringify({
        keyboard: [
          ['Onion'],
          ['Not the Onion']]
      })
    };

  // Check what user Said
  if (msg.text === 'Not the Onion') {
    var onion = 'nottheonion'
  } else {
    var onion = 'TheOnion'
  }

  // Check if they were right
  // If so, give them a point
  db.get(msg.from.id + 't', function (err, value) {
    if (value == onion) {
      client.RANDOMKEY([], function (err, results) {
            var key = results;
            client.hget(key, "Title", function (err, resultt) {
                var title = resultt;
                client.hget(key, "Category", function (err, resultc) {
                    var category = resultc;
                    client.hget(key, "URL", function (err, resultu) {
                        var link = resultu;
                        var resp = title;
                        db.put(msg.from.id + 't', category, function (err) {
                          if (err) return console.log('Error!', err) // some kind of I/O error
                          bot.sendMessage(msg.from.id, resp, opts);
                        })
                    });
                });
            });
      });

      db.get(msg.from.id + 's', function (err, value) {
        if (value === "NaN") {
          var thingy12 = 0;
        } else {
          var thingy12 = parseInt(value, 10) + 1
        }
        db.put(msg.from.id + 's', thingy12, function (err) {
          if (err) return console.log(err);
          bot.sendMessage(msg.from.id, "Correct! " + thingy12, opts);
        })
      });

    } else {
      client.RANDOMKEY([], function (err, results) {
            var key = results;
            client.hget(key, "Title", function (err, resultt) {
                var title = resultt;
                client.hget(key, "Category", function (err, resultc) {
                    var category = resultc;
                    client.hget(key, "URL", function (err, resultu) {
                        var link = resultu;
                        var resp = title;
                        db.put(msg.from.id + 't', category, function (err) {
                          if (err) return console.log('Error!', err) // some kind of I/O error
                          bot.sendMessage(msg.from.id, resp, opts);
                        })
                    });
                });
            });
      });

      db.get(msg.from.id + 's', function (err, value) {
        if (value === "NaN") {
          var thingy12 = parseInt(value, 10) + 1
        } else {
          var thingy12 = value - 1
        }
        db.put(msg.from.id + 's', thingy12, function (err) {
          if (err) return console.log(err);
          bot.sendMessage(msg.from.id, "Incorrect!" + thingy12, opts);
        })
      });

    }
  })
});
