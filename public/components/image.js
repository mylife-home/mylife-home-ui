'use strict';

angular.module('mylife-home-ui.components.image', [])

.factory('image', function($rootScope) {
  return {
    meta: function(url, done) {
      const img = new Image();
      img.addEventListener('load', () => {
        $rootScope.$apply(() => {
          done({
            width: img.naturalWidth,
            height: img.naturalHeight
          });
        });
      });
      img.src = url;
    }
  };
});
