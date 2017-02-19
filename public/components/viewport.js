'use strict';
'format es6';

import browser from '../utils/detect-browser.js';
import viewport from '../utils/viewport.js';

angular.module('mylife-home-ui.components.viewport', [])

.directive('viewportSize', function($parse, inputManager) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {

      if(!browser.isMobile) { return; }

      scope.$watch(attrs.viewportSize, (size) => {
        if(!size) { return; }
        viewport.setDimensions(size.width, size.height);
      }, true);
    }
  };
});