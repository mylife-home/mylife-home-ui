'use strict';

import 'angular';
import 'angular-route';
import 'angular-bootstrap';
import './components/data.js';
import './components/repository.js';
import './components/window.js';
import './components/input.js';
import './components/layout.js';
import './components/image.js';
import './views/window.js';

angular.module('mylife-home-ui', [
  'ngRoute',
  'ui.bootstrap',
  'mylife-home-ui.components.data',
  'mylife-home-ui.components.window',
  'mylife-home-ui.components.input',
  'mylife-home-ui.components.layout',
  'mylife-home-ui.components.image',
  'mylife-home-ui.views.window'
])

.run(function($location, windowManager) {
  windowManager.init(function() {
    $location.url('/' + windowManager.defaultWindowId);
  });
});
