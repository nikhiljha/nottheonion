// Author: Nikhil Jha
// License: MIT

// Not the Onion?
// Can you tell if an article is from the Onion, or is it real?

// Init Dependencies
var TelegramBot = require('node-telegram-bot-api');
var FeedParser = require('feedparser')
  , request = require('request');
  var jsonfile = require('jsonfile')

// Grab the RSS feed
var FeedParser = require('feedparser')
  , request = require('request');
var req = request('https://www.reddit.com/r/theonion+nottheonion/hot/.rss')
  , feedparser = new FeedParser();
req.on('error', function (error) {
});
req.on('response', function (res) {
  var stream = this;
  if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));
  stream.pipe(feedparser);
});
feedparser.on('error', function(error) {
});
feedparser.on('readable', function() {
  var stream = this
    , meta = this.meta
    , item;
  while (item = stream.read()) {
    console.log(item.title);
  }
});

//
