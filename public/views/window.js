'use strict';
'format es6';

angular.module('mylife-home-ui.views.window', ['ngRoute', 'mylife-home-ui.components.window'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/:id', {
    templateUrl: 'views/window.html',
    controller: 'windowController'
  });
}])

.controller('windowController', function($routeParams, $scope, windowManager) {
  windowManager.change($routeParams.id, () => {});
  console.log(windowManager);
  $scope.manager = windowManager;

  $scope.utils = {
    isControlActive: function(control) {
      return control.primaryAction.spec || control.secondaryAction.spec;
    }
  }
});
