require('./init');
var expect = require('chai').expect;
var TwitterContentService = require('../lib/fetching/content-services/twitter-content-service');

describe('Twitter content service', function() {
  before(function(done) {
    twitterContentService = new TwitterContentService({keywords: 't'});
    done();
  });

  it('should fetch content from Twitter', function(done) {
    twitterContentService.start();
    twitterContentService.once('report', function(report_data) {
      expect(report_data).to.have.property('content');
      expect(report_data.content.toLowerCase()).to.contain('t');
      // Stop stream to ensure a single fetch
      twitterContentService.stop();
      done();
    });
  });

});
