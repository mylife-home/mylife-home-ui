'use strict';

import 'angular';
import 'angular-route';
import './components/data.js';
import './components/window.js';

import './components/version/version.js';
import './components/version/interpolate-filter.js';
import './components/version/version-directive.js';
import './view1/view1.js';
import './view2/view2.js';

angular.module('mylife-home-ui', [
  'mylife-home-ui.data',
  'mylife-home-ui.window',
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
