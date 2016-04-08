var express = require('express');
var app = express();

var http = require('http');
var sockjs = require('sockjs');
var echo = sockjs.createServer();
var server = http.createServer(app);
var extend = require('xtend');

var sharedEvents = require('./server/sharedEventEmitter.js');

// Import environment variables
require('dotenv').load();


/**
 * Start the server
 */
var port = process.env.PORT || 3000;
server.listen(port);

echo.installHandlers(server, {
  prefix:'/echo'
});
server.listen(9997, '0.0.0.0');

/**
 * Load the different builds
 */
var builds = ['campus-solutions', 'crosswalk', 'hub'];
var loadBuilds = function() {
  builds.forEach(function(service) {
    require('./server/' + service + '.js').init();
  });
};
loadBuilds();

/**
 * Set up the socket connection
 */
var response = {
  campusSolutions: {},
  crosswalk: {},
  hub: {}
};

var listenScrape = function(item) {
  sharedEvents.on('scraped.' + item, function(result) {
    response[item] = extend(response[item], result);
  });
};
for (var i in response) {
  if (response.hasOwnProperty(i)) {
    listenScrape(i);
  }
}

echo.on('connection', function(conn) {

  var emitSocket = function() {
    response['time'] = getCurrentTime();
    conn.write(JSON.stringify(response));
  };

  // Emit socket at 0 & every 3 seconds
  emitSocket();
  setInterval(emitSocket, 3000);

});

var getCurrentTime = function() {
  var date = new Date();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var time = hours + ':' + minutes + ' ' + ampm;
  return time;
}
