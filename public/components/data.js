'use strict';

angular.module('mylife-home-ui.data')
.factory('resources', function($resource) {
  return $resource('', {}, {
    enum : { method : get, url : '/resources/enum', isArray : true, cache : true },
    get  : { method : get, url : '/resources/get/:id', cache : true }
  });
})
.factory('socket', function() {
  return io();
});
