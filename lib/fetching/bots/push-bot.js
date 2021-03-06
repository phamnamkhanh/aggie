var Bot = require('../bot');
var util = require('util');

var PushBot = function(options) {
  Bot.call(this, options);
};

util.inherits(PushBot, Bot);

PushBot.prototype.start = function() {
  this.contentService.start();
  PushBot.super_.prototype.start.apply(this);
};

PushBot.prototype.stop = function() {
  this.contentService.stop();
  PushBot.super_.prototype.stop.apply(this);
};

module.exports = PushBot;
