var Twit = require('twit');
var config = require('../../../config/secrets').twitter;
var ContentService = require('../content-service');
var util = require('util');
var logger = require('../../logger');

var TwitterContentService = function(options) {
  this.twit = new Twit(config);
  this.keywords = options.keywords;
  this.sourceType = 'twitter';
  this.botType = 'push';
  this._isStreaming = false;
  ContentService.call(this);
};

util.inherits(TwitterContentService, ContentService);

// Set/change filter stream
TwitterContentService.prototype.setFilterStream = function(keywords) {
  if (typeof keywords === 'string') {
    this.keywords = keywords;
  }
};

// Start/resume streaming of filtered data
TwitterContentService.prototype.start = function() {
  if (this._isStreaming) return;
  if (this.stream) {
    this.stream.start();
  } else {
    this.streamName = 'statuses/filter';
    this.stream = this.twit.stream(this.streamName, {track: this.keywords});
    this.addListeners();
  }
  this._isStreaming = true;
  logger('TwitterContentService#start');
  logger.debug(this);
};

// Stop the stream
TwitterContentService.prototype.stop = function() {
  if (this.stream) {
    this.stream.stop();
  }
  this._isStreaming = false;
  logger('TwitterContentService#stop');
  logger.debug(this);
};

// Wrapper for stream event listener
TwitterContentService.prototype.addListeners = function() {
  if (this.stream) {
    // Avoid re-adding the same listeners
    var listeners = this.stream.listeners('tweet');
    if (listeners.length !== 0) return;
  } else {
    // Bail if stream has not been started
    return;
  }
  var self = this;
  this.stream.on('tweet', function(tweet) {
    self.emit('report', self._parse(tweet));
  });
  this.stream.on('limit', function(message) {
    self.emit('warning', new Error('Twitter sent rate limitation: ' + JSON.stringify(message.limit)));
  });
  this.stream.on('disconnect', function(message) {
    self.emit('warning', new Error('Twitter sent disconnect: ' + JSON.stringify(message.disconnect)));
  });
  this.stream.on('reconnect', function(request, response, connectInterval) {
    self.emit('warning', new Error('Reconnecting to Twitter in ' + (connectInterval / 1000) + ' seconds'));
  });
  this.stream.on('warning', function(message) {
    self.emit('warning', new Error('Twitter sent warning: ' + JSON.stringify(message.warning)));
  });
};

TwitterContentService.prototype._parse = function(data) {
  var author = data.user ? data.user.screen_name : null;
  return {
    authoredAt: data.created_at,
    fetchedAt: new Date(),
    content: data.text,
    author: author,
    url: author ? 'https://twitter.com/' + author + '/status/' + data.id_str : null
  };
};

module.exports = TwitterContentService;
