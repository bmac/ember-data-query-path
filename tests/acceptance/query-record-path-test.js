import { test } from 'qunit';
import Pretender from 'pretender';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | query record path', {
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

test('visiting /query-record-path', function(assert) {
  visit('/query-record-path');

  andThen(function() {
    assert.equal(currentURL(), '/query-record-path');
  });

  var server = this.server;
  andThen(function() {
    assert.equal(server.handledRequests[0].url, '/posts/recent');
    assert.equal(server.handledRequests.length, 1);
  });
});


test('visiting /query-record-path-params', function(assert) {

  var server = this.server;
  visit('/query-record-path-params');

  andThen(function() {
    assert.equal(currentURL(), '/query-record-path-params');
  });
  
  andThen(function() {
    var request = server.handledRequests[0];
    assert.equal(request.url, '/posts/recent?include=comments');
    assert.deepEqual(request.queryParams, { include: 'comments' });
    assert.equal(server.handledRequests.length, 1);
  });
});
