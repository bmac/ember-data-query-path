# Ember-data-query-path

This mixin makes it easy for Ember Data to issue request to url paths.

## Requirements
* Ember >= 1.13.0
* Ember Data >= 1.13.0
* Ember CLI

## Installing

* ember-cli >= 0.2.3 `ember install ember-data-query-path`

## Upgrading

Please clear `node_modules` and `bower_components` before reporting issues after upgrading.

## Usage

To setup the plugin you must mix it into your store service.
```js
// app/services/store.js
import DS from 'ember-data';
import QueryPath from 'ember-data-query-path/mixins/query-path';

export default DS.Store.extend(QueryPath);
```

Then you can use `queryPath` and `queryPathRecord` methods on your store.

`queryPath` can be used to make a request a path that is expected to return an array of results.

```js
// app/routes/my-route.js
import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    // request to /posts/recent?include=comments
    return this.store.queryPath('post', 'recent', { include: 'comments' });
  }
});
```

`queryRecordPath` can be used to make a request a path that is expected to return an a single record.


```js
// app/routes/my-route.js
import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    // request to /users/current?include=permissions
    return this.store.queryRecordPath('user', 'current', { include: 'permissions' });
  }
});
```



## Development

* `git clone` this repository
* `npm install`
* `bower install`
* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).