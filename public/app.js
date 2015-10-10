'use strict';

import 'angular';
import 'angular-route';
import './components/data.js';
import './components/window.js';
import './views/window.js';

angular.module('mylife-home-ui', [
  'ngRoute',
  'mylife-home-ui.components.data',
  'mylife-home-ui.components.window',
  'mylife-home-ui.views.window'
])

.run(function($location, windowManager) {
  windowManager.init(function() {
    $location.url('/' + windowManager.defaultWindowId);
  });
});
