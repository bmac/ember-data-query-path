import Ember from 'ember';
var Promise = Ember.RSVP.Promise;
import {
  promiseArray,
  promiseObject,
} from "ember-data/-private/system/promise-proxies";
import {
  serializerForAdapter
} from "ember-data/-private/system/store/serializers";
import {
  _bind,
  _guard,
  _objectIsAlive
} from "ember-data/-private/system/store/common";
import {
  normalizeResponseHelper
} from "ember-data/-private/system/store/serializer-response";



function _queryPathPromise(adapter, store, typeClass, path, query, recordArray, requestType) {
  if (adapter.queryPath) {
    return adapter.queryPath(store, typeClass, query, recordArray);
  }

  // 'ds-improved-ajax' Ember Data feature
  if (adapter._requestFor) {
    var request = adapter._requestFor({
      store,
      path,
      data: query,
      requestType: requestType
    });

    if (request.url.indexOf(path) === -1) {
      request.url = adapter.urlPrefix(path, adapter.buildURL(typeClass.modelName, null, null, requestType));
    }
    
    return adapter._makeRequest(request);
  }

  var url = adapter.urlPrefix(path, adapter.buildURL(typeClass.modelName, null, null, requestType));
  return adapter.ajax(url, 'GET', { data: query });
}

function _queryPath(adapter, store, typeClass, path, query, recordArray) {
  var modelName = typeClass.modelName;
  var promise = _queryPathPromise(adapter, store, typeClass, path, query, recordArray, 'queryPath');

  var serializer = serializerForAdapter(store, adapter, modelName);
  var label = `QueryPathMixin: Handle Adapter#queryPath of type: ${typeClass} path: ${path}`;

  promise = Promise.resolve(promise, label);
  promise = _guard(promise, _bind(_objectIsAlive, store));

  return promise.then(function(adapterPayload) {
    var records, payload;
    store._adapterRun(function() {
      payload = normalizeResponseHelper(serializer, store, typeClass, adapterPayload, null, 'query');
      records = store.push(payload);
    });

    recordArray.loadRecords(records, payload);
    return recordArray;

  }, null, `QueryPathMixin: Extract #queryPath of type: ${typeClass} path: ${path}`);
}

function _queryRecordPath(adapter, store, typeClass, path, query) {
  var modelName = typeClass.modelName;
  var promise = _queryPathPromise(adapter, store, typeClass, path, query, null, 'queryRecordPath');
  var serializer = serializerForAdapter(store, adapter, modelName);
  var label = `QueryPathMixin: Handle Adapter#queryRecordPath of type: ${typeClass} path: ${path}`;

  promise = Promise.resolve(promise, label);
  promise = _guard(promise, _bind(_objectIsAlive, store));

  return promise.then(function(adapterPayload) {
    var record;
    store._adapterRun(function() {
      var payload = normalizeResponseHelper(serializer, store, typeClass, adapterPayload, null, 'queryRecord');

      record = store.push(payload);
    });

    return record;
  });
}

export default Ember.Mixin.create({

  queryPath: function(modelName, path, query) {
    var typeClass = this.modelFor(modelName);
    var array = this.recordArrayManager.createAdapterPopulatedRecordArray(typeClass, query);
    var adapter = this.adapterFor(modelName);
    return promiseArray(_queryPath(adapter, this, typeClass, path, query, array));
  },

  queryRecordPath: function(modelName, path, query={}) {

    var typeClass = this.modelFor(modelName);
    var adapter = this.adapterFor(modelName);

    return promiseObject(_queryRecordPath(adapter, this, typeClass, path, query));
  }
});
