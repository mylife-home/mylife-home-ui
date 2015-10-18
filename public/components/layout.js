'use strict';

angular.module('mylife-home-ui.components.layout', [])

.directive('size', function($parse, inputManager) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs){

      scope.$watch(attrs.size, (value) => {
        console.log('toto');
        element.css('height', value.height + 'px');
        element.css('width', value.width + 'px');
      });
    }
  };
});