'use strict';

import async from 'async';

angular.module('mylife-home-ui.components.window', ['mylife-home-ui.components.data', 'mylife-home-ui.components.repository'])

.factory('windowManager', function(resources, socket, repository, $location) {

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

  manager.close = function() {
    if(manager.windows.length <= 1) { return; } // popup only
    manager.windows.pop();
  }

  // ------------- Window factory part ---------------------

  function windowFactory(windowId, done) {

    resources.load('window.' + windowId, function(data) {

      const loaders = [];

      function loadImage(imageId, setter) {
        loaders.push((done) => {
          resources.load('image.' + imageId, function(data) {
            setter('data:image/png;base64,' + data);
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
                manager.popup(wspec.id, () => { });
              } else {
                //manager.change(wspec.id, () => { });
                $location.url('/' + wspec.id);
              }
            };
          }
        }

        if(!a.execute) {
          a.execute = () => { };
        }

        return a;
      }

      function loadDisplay(spec) {
        if(!spec) { return () => null; }

        const images = {};

        function loadImageLocal(key) {
          if(images.hasOwnProperty(key)) { return; } // already loading
          images[key] = null;
          loadImage(key, (img) => images[key] = img);
        }

        if(spec.default_resource_id) {
          loadImageLocal(spec.default_resource_id);
        }

        for(let item of spec.map) {
          loadImageLocal(item.resource_id);
        }

        let itemFinder;
        if(!spec.map.length) {
          itemFinder = () => null;
        }
        else if(spec.map[0].hasOwnProperty('value')) {
          itemFinder = (value) => {
            for(let item of spec.map) {
              if(item.value === value) {
                return item;
              }
            }
            return null;
          };
        }
        else {
          itemFinder = (value) => {
            value = parseInt(value);
            for(let item of spec.map) {
              if(item.min <= value && value <= item.max) { // TODO: check correct naming
                return item;
              }
            }
            return null;
          };
        }

        return () => {
          let value;
          const obj = repository.get(spec.component_id);
          if(obj) { value = obj[spec.component_attribute]; }
          const item = value ? null : itemFinder(value);
          if(item) {
            return images[item.resource_id];
          }
          return images[spec.default_resource_id];
        };
      }

      function loadText(spec) {
        if(!spec) { return () => null; }

        function valueGetter(item) {
          return () => {
            let value;
            const obj = repository.get(item.component_id);
            if(obj) { value = obj[item.component_attribute]; }
            return value || '';
          };
        }

        const context = [];

        for(let item of spec.context) {
          context.push({ id : '#' + item.id + '#', getter : valueGetter(item) });
        }

        return () => {
          let text = spec.format;
          for(let item of context) {
            text = text.replace(new RegExp(item.id, 'g'), item.getter());
          }
          return text;
        };
      }

      function loadControl(spec) {
        const c = {
          spec : spec,
          id   : spec.id,

          height          : spec.height,
          width           : spec.width,
          x               : 0, // TODO: ratio
          y               : 0, // TODO: ratio
          primaryAction   : loadAction(spec.primary_action),
          secondaryAction : loadAction(spec.secondary_action),
          display         : null,
          text            : null
        };

        Object.defineProperty(c, 'display', { get : loadDisplay(spec.display) });
        Object.defineProperty(c, 'text', { get : loadText(spec.text) });

        return c;
      }

      const spec = JSON.parse(data).window;

      const w = {
        spec       : spec,
        id         : spec.id,

        height          : spec.height, // TODO: handle undefined
        width           : spec.width, // TODO: handle undefined
        background : null,
        controls   : []
      };

      if(w.spec.background_resource_id) {
        loadImage(w.spec.background_resource_id, (img) => w.background = img);
      }

      for(let ctrlSpec of spec.controls) {
        const c = loadControl(ctrlSpec);
        w.controls.push(c);
      }

      async.parallel(loaders, () => done(w));
    });
  }

  return manager;
});
