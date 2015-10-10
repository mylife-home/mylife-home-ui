'use strict';

angular.module('mylife-home-ui.components.window', ['mylife-home-ui.components.data'])

.factory('windowFactory', function(resources, socket) {
  return function(id, cb) {
    const w = {};

    w.spec = resources.load('window.' + id, function() {
      // TODO : load sub-resources and create object related components
      console.log(w);
      cb();
    });

    return w;
  };
})

.factory('windowManager', function(resources, windowFactory) {
  const manager = {
    defaultWindowId: null
  };

  manager.init = function(done) {
    resources.load('default_window', function(data) {
      console.log(data);
      manager.defaultWindowId = data;
      done();
    });
  };

  return manager;
})
