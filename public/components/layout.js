'use strict';

angular.module('mylife-home-ui.components.layout', [])

.directive('size', function($parse) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs){

      scope.$watch(attrs.size, (value) => {
        element.css('height', value.height + 'px');
        element.css('width', value.width + 'px');
      }, true);
    }
  };
})

.directive('position', function($parse) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs){

      scope.$watch(attrs.position, (value) => {
        element.css('left', value.x + 'px');
        element.css('top', value.y + 'px');
      }, true);
    }
  };
});

