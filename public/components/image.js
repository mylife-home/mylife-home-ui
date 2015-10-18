'use strict';

angular.module('mylife-home-ui.components.image', [])

.factory('image', function($rootScope) {
  return {
    getMeta: function(url, done) {
      const img = new Image();
      img.on('load', () => {
        $rootScope.$apply(() => {
          return {
            width: img.naturalWidth,
            height: thimgis.naturalHeight
          };
        });
      });
      img.src = url;
    }
  };
});
