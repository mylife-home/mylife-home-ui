'use strict';

angular.module('mylife-home-ui.window', ['mylife-home-ui.data'])
.factory('windowFactory', function(resources, socket) {
  return function(id, cb) {
    const w = {};

    w.spec = resources.get('window.' + id, function() {
      // TODO : load sub-reources and create object related components

      cb();
    });

    return w;
  };
});
