'use strict';

angular.module('mylife-home-ui.views.window', ['ngRoute', 'mylife-home-ui.components.window'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/:id', {
    templateUrl: 'views/window.html',
    controller: 'windowController'
  });
}])

.controller('windowController', function($routeParams, $scope, windowManager) {
  $scope.loading = windowManager.loading;
  windowManager.change($routeParams.id, () => {
    console.log(windowManager.windows);
    $scope.windows = windowManager.windows;
    $scope.close = () => windowManager.close();
  });
});

// TODO: get old 'click handling' code (mylife home ui web old)
