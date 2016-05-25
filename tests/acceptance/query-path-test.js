import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';
import Pretender from 'pretender';

moduleForAcceptance('Acceptance | query path', {
  beforeEach: function() {
    this.server = new Pretender(function(){
      this.get('/posts/recent', function(){
        return [
          200,
          {'content-type': 'application/javascript'},
          '{"data": []}'
        ];
      });
    });
  },
  afterEach: function() {
    this.server.shutdown();
  }
});

test('visiting /query-path', function(assert) {

  var server = this.server;
  visit('/query-path');

  andThen(function() {
    assert.equal(currentURL(), '/query-path');
  });
  
  andThen(function() {
    assert.equal(server.handledRequests[0].url, '/posts/recent');
    assert.equal(server.handledRequests.length, 1);
  });
});


test('visiting /query-path-params', function(assert) {

  var server = this.server;
  visit('/query-path-params');

  andThen(function() {
    assert.equal(currentURL(), '/query-path-params');
  });
  
  andThen(function() {
    var request = server.handledRequests[0];
    assert.equal(request.url, '/posts/recent?include=comments');
    assert.deepEqual(request.queryParams, { include: 'comments' });
    assert.equal(server.handledRequests.length, 1);
  });
});
