'use strict';

import async from 'async';

angular.module('mylife-home-ui.components.window', ['mylife-home-ui.components.data'])

.factory('windowManager', function(resources, socket) {

  // ------------- Window management part ---------------------

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

  // ------------- Window factory part ---------------------

  function windowFactory(windowId, done) {

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

      function loadAction(spec) {
        if(!spec) { spec = null; }

        const a = {
          spec : spec
        };

        if(spec) {
          const cspec = spec.component;
          if(cspec) {
            a.execute = () => {
              socket.emit('action', {
                id   : cspec.component_id,
                name : cspec.component_action
                //args :[]
              });
            };
          }

          const wspec = spec.window;
          if(wspec) {
            a.execute = function() {
              if(wspec.popup) {
                windowFactory.popup(wspec.id, () => { });
              } else {
                windowFactory.change(wspec.id, () => { });
              }
            };
          }
        }

        if(!a.execute) {
          a.execute = () => { };
        }

        return a;
      }

      function loadControl(spec) {
        const c = {
          spec : ctrlSpec,
          id   : ctrlSpec.id,

          height          : ctrlSpec.height,
          width           : ctrlSpec.width,
          x               : 0, // TODO
          y               : 0, // TODO
          primaryAction   : loadAction(spec.primary_action),
          secondaryAction : loadAction(spec.secondary_action),
          display         : null, // TODO
          text            : null // TODO
        };

        return c;
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
        const c = loadControl(ctrlSpec);
        w.controls.push(c);
      }

      async.parallel(loaders, () => done(w));
    });
  };

  return manager;
});
