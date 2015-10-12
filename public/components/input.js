'use strict';

angular.module('mylife-home-ui.components.input', [])

.directive('inputHandler', function($parse, inputManager) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs){

      function isTouchDevice() {
        return !!('ontouchstart' in window);
      }

      var config = $parse(attrs.inputHandler)(scope);
      var manager = inputManager(config);

      if(isTouchDevice()) {
        element.bind('touchstart', function(event) {
          manager.down();
          event.preventDefault();
        });
        element.bind('touchend', function(event) {
          manager.up();
          event.preventDefault();
        });
      } else {
        element.bind('mousedown', function(event) {
          manager.down();
          event.preventDefault();
        });
        element.bind('mouseup', function(event) {
          manager.up();
          event.preventDefault();
        });
      }
    }
  };
})

/**
 * Gestion du mouseup/mousedown
 */
.factory('inputManager', function($timeout) {

  return function(config) {

    var lastDown = null;
    var eventStack = '';
    var endWait = null;

    var executeEvents = function() {
      console.debug('inputManager: execute events : \'' + eventStack + '\')');

      var fn = config[eventStack];
      if(fn) {
        fn();
      }
    };

    return {

      down: function() {
        // Pas de fin de saisie de suite
        if(endWait) {
          $timeout.cancel(endWait);
        }

        lastDown = {
          timestamp: new Date().getTime()
        };
      },

      up: function() {
        // Pas de fin de saisie de suite
        if(endWait) {
          $timeout.cancel(endWait);
        }
        // Si pas de down, tchao
        if(!lastDown) {
          eventStack = '';
          return;
        }

        // Prise en compte de l'event
        var down_ts = lastDown.timestamp;
        var up_ts = new Date().getTime();
        lastDown = null;

        // Ajout de l'event
        if(up_ts - down_ts < 500) {
          eventStack += 's';
        } else {
          eventStack += 'l';
        }

        // Attente de la fin de saisie
        endWait = $timeout(function() {
          executeEvents();

          eventStack = '';
          endWait = null;
        }, 300);
      }
    };
  };
});