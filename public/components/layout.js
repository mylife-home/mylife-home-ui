'use strict';

angular.module('mylife-home-ui.components.layout', [])

.directive('size', function($parse) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs){

      scope.$watch(attrs.size, (value) => {
        element.css('height', value.height + 'px');
        element.css('width', value.width + 'px');
      });
    }
  };
})

.directive('position', function($parse) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs){

      scope.$watch(attrs.size, (value) => {
        element.css('x', value.left + 'px');
        element.css('y', value.top + 'px');
      });
    }
  };
});

