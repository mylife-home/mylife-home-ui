'use strict';

angular.module('mylife-home-ui.views.window', ['ngRoute', 'mylife-home-ui.components.window'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/:id', {
    templateUrl: 'views/window.html',
    controller: 'windowController'
  });
}])

.controller('windowController', function($routeParams, $scope, windowManager) {
  $scope.windowId = $routeParams.id;
  $scope.windowManager = windowManager;
});