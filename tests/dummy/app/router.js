import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('query-path');
  this.route('query-path-params');
  this.route('query-record-path');
  this.route('query-record-path-params');
});

export default Router;
