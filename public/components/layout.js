'use strict';
'format es6';

angular.module('mylife-home-ui.components.layout', [])

.directive('size', ['internals.layoutInitFactory', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs){

      scope.$watch(attrs.size, (value) => {
        element.css('height', value.height + 'px');
        element.css('width', value.width + 'px');
      }, true);
    }
  };
}])

.directive('position', ['internals.layoutInitFactory', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs){

      scope.$watch(attrs.position, (value) => {
        element.css('left', value.x + 'px');
        element.css('top', value.y + 'px');
      }, true);
    }
  };
}])

.factory('internals.layoutInitFactory', function($window, $rootScope) {
  angular.element($window).bind('resize', () => {
    $rootScope.$digest();
  });
  return {};
});