'use strict';

import io from 'socket.io-client';

angular.module('mylife-home-ui.components.data', [])

.factory('resources', function($http) {
  return {
    load: function(name, cb) {
      $http.get('/resources/get/' + name, { cache : true })
        .then(function(res) {
          cb(res.data);
        }, function(error) {
          console.log(error);
        });
    }
  };
})

.factory('socket', function() {
  return io();
});
