var contentServiceFactory = require('./content-service-factory');

var BotFactory = function() {};

BotFactory.prototype.create = function(options) {
  var contentService = contentServiceFactory.create(options);
  var SubBot = this.botType(contentService);
  var bot = new SubBot(contentService);
  return bot;
};

BotFactory.prototype.botType = function(contentService) {
  return require('./bots/' + contentService.type + '-bot');
};

// Export a new instance, ensuring a singleton
module.exports = new BotFactory();
