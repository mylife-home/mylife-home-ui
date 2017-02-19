'use strict';
'format es6';

/*

Format données fenêtre
{
  "id" : "w1",
  "height" : "0.5", //en fraction de la taille de l'écran, uniquement utilisé si popup (sinon fullscreen)
  "width" : "0.25", //en fraction de la taille de l'écran, uniquement utilisé si popup (sinon fullscreen)
  "background_resource_id" : "bg_res",
  "style": "données css", // facultatif
  "controls" : [
    {
      "id": "c1",
      "x" : "0.23", // x du milieu du control, en fraction de la taille de la fenêtre
      "y" : "0.27", // y du milieu du control, en fraction de la taille de la fenêtre
      "height" : "12", // px, facultatif
      "width" : "12", // px, facultatif
      "style": "données css", // facultatif

      "display": { // mutuellement exclusif avec text
        "default_resource_id": "res_id", // image par défaut
        "component_id": "obj_id", // si non défini, pas de modif de l'image
        "component_attribute": "attr",
        "map": [
          {
            "value": "enum_value", // pour les attributs enum
            "min": "range_min", // pour les attributs range
            "max": "range_max", // pour les attributs range
            "resource_id": "res_id"
          },
          ...
        ]
      }

      "text": { // mutuellement exclusif avec display
        "format": "toto, avec des #data_id#", // toto en javascript, avec des valeur_de_data_id
        "context": [
          {
                    "component_id": "cid",
                    "component_attribute": "attr",
                    "id": "data_id"
          }
        ]
      },

      "primary_action": {
        "window": { // soit ca soit component
          "id": "wid",
          "popup": "true|false",
        }
        "component": { // soit ca soit window
          "component_id": "obj_id",
          "component_action": "obj_action"
        }
      }

      "secondary_action": {} // pareil que primary
    },
    ...
  ]
}

*/

import async from 'async';

angular.module('mylife-home-ui.components.window', [
  'mylife-home-ui.components.data', 'mylife-home-ui.components.repository', 'mylife-home-ui.components.image'])

.factory('windowManager', function($location, $window, resources, socket, repository, image) {

  const DEFAULT_SIZE = { width: 800, height: 600 };

  // ------------- Window management part ---------------------

  const cachedWindows = { };

  const manager = {
    defaultWindows : {},
    windows        : [],
    loading        : false
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
    manager.loading = true;
    resources.load('default_window', function(data) {
      manager.defaultWindows = JSON.parse(data);
      manager.loading = false;
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
  };

  // ------------- Window factory part ---------------------

  function windowFactory(windowId, done) {

    resources.load('window.' + windowId, function(data) {

      const loaders = [];
      const imageLoaders = {};

      function loadImage(imageId, setter) {
        let setters = imageLoaders[imageId];
        if(!setters) {
          setters = imageLoaders[imageId] = [];
          loaders.push((done) => {
            resources.load('image.' + imageId, function(data) {
              data = 'data:image/png;base64,' + data;
              for(let setter of setters) {
                setter(data);
              }
              done();
            });
          });
        }
        setters.push(setter);
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
        else if(typeof(spec.map[0].value) === 'string') {
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
              if(item.min <= value && value <= item.max) {
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
          const item = value === undefined ? null : itemFinder(value);
          if(item) {
            return images[item.resource_id];
          }
          return images[spec.default_resource_id];
        };
      }

      function loadText(spec) {
        if(!spec) { return () => null; }

        const argNames = spec.context.map(item => item.id).join(',');
        let func;
        try {
          func = new Function(argNames, spec.format);
        } catch(err) {
          console.error(err);
          func = () => err.message;
        }

        return () => {
          const args = spec.context.map(item => {
            let value;
            const obj = repository.get(item.component_id);
            if(obj) { value = obj[item.component_attribute]; }
            return value;
          });

          try {
            return func.apply(null, args);
          } catch(err) {
            console.error(err);
            return err.message;
          }
        };
      }

      function loadControl(window, spec) {
        const c = {
          spec            : spec,
          id              : spec.id,
          size            : { height: spec.height, width: spec.width },
          primaryAction   : loadAction(spec.primary_action),
          secondaryAction : loadAction(spec.secondary_action),
          display         : null,
          text            : null
        };

        Object.defineProperty(c, 'display', { get : loadDisplay(spec.display) });
        Object.defineProperty(c, 'text', { get : loadText(spec.text) });

        Object.defineProperty(c, 'position', { get : () => {
          return {
            x : (window.size.width * c.spec.x) - (c.size.width / 2),
            y : (window.size.height * c.spec.y) - (c.size.height / 2)
          };
        }});

        return c;
      }

      const spec = JSON.parse(data).window;

      const w = {
        spec           : spec,
        id             : spec.id,
        background     : null,
        controls       : [],
        backgroundMeta : null
      };

      if(w.spec.background_resource_id) {
        loadImage(w.spec.background_resource_id, (img) => {
          w.background = img;
          image.meta(img, (meta) => {
            w.backgroundMeta = meta;
          });
        });
      }

      if(spec.height && spec.width) {
        w.size = { height: spec.height, width: spec.width };
      } else {
        Object.defineProperty(w, 'size', { get : () => {

          const meta = w.backgroundMeta;
          if(!meta) { return DEFAULT_SIZE; }
          const windowSize = {
            width: $window.innerWidth || $window.clientWidth,
            height: $window.innerHeight || $window.clientHeight
          };

          const imageRatio = meta.width / meta.height;
          const windowRatio = windowSize.width / windowSize.height;
          let zoom;
          if(windowRatio > imageRatio) {
            // height-driven
            zoom = windowSize.height / meta.height;
          } else {
            // width-driven
            zoom = windowSize.width / meta.width;
          }

          return {
            width: meta.width * zoom,
            height: meta.height * zoom
          };
        }});
      }

      for(let ctrlSpec of spec.controls) {
        const c = loadControl(w, ctrlSpec);
        w.controls.push(c);
      }

      async.parallel(loaders, () => done(w));
    });
  }

  return manager;
});
