// Setup Redis
var options = {
  "host": "192.168.1.116",
}
var redis = require("redis"),
    client = redis.createClient(options);

client.on("error", function (err) {
    console.log("Error " + err);
});

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
    client.hset(item.guid, "Title", item.title, redis.print);
    client.hset(item.guid, "Category", item.categories[0], redis.print);
    client.hset(item.guid, "URL", item.link, redis.print);
  }
});
