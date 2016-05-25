import Ember from 'ember';
import QueryPathMixin from 'ember-data-query-path/mixins/query-path';
import { module, test } from 'qunit';

module('Unit | Mixin | query path');

// Replace this with your real tests.
test('it works', function(assert) {
  let QueryPathObject = Ember.Object.extend(QueryPathMixin);
  let subject = QueryPathObject.create();
  assert.ok(subject);
});
