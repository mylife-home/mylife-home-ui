'use strict';

import async from 'async';

angular.module('mylife-home-ui.components.window', ['mylife-home-ui.components.data'])

.factory('windowFactory', function(resources, socket) {
  return function(windowId, done) {

    resources.load('window.' + windowId, function(data) {

      const loaders = [];

      function loadImage(imageId, setter) {
        loaders.push((done) => {
          resources.load('image.' + imageId, function(data) {
            setter(data);
            done();
          });
        });
      }

      const spec = JSON.parse(data).window;

      const w = {
        spec       : spec,
        id         : spec.id,

        background : null,
        controls   : []
      };

      if(w.spec.background_resource_id) {
        loadImage(w.spec.background_resource_id, (img) => w.background = 'data:image/png;base64,' + img);
      }

      for(let ctrlSpec of spec.controls) {
        const c = {
          spec : ctrlSpec,
          id   : ctrlSpec.id,

          height          : ctrlSpec.height,
          width           : ctrlSpec.width,
          x               : 0, // TODO
          y               : 0, // TODO
          primaryAction   : null, // TODO
          secondaryAction : null, // TODO
          display         : null, // TODO
          text            : null // TODO
        };

        w.controls.push(c);
      }

      async.parallel(loaders, () => done(w));
    });
  };
})

.factory('windowManager', function(resources, windowFactory) {

  const cachedWindows = { };

  const manager = {
    defaultWindowId : null,
    windows         : [],
    loading         : false
  };

  function load(windowId, done) {
    const cw = cachedWindows[windowId];
    if(cw) { return done(cw); }

    manager.loading = true;
    return windowFactory(windowId, function(w) {
      manager.loading = false;
      return done(w);
    });
  }

  manager.init = function(done) {
    resources.load('default_window', function(data) {
      manager.defaultWindowId = data;
      done();
    });
  };

  manager.popup = function(windowId, done) {
    return load(windowId, function(w) {
      manager.windows.push(w);
      done(w);
    });
  };

  manager.change = function(windowId, done) {
    return load(windowId, function(w) {
      manager.windows.length = 0;
      manager.windows.push(w);
      done(w);
    });
  };

  return manager;
});
