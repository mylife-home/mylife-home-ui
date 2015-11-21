// Configure module loader
System.config({
  baseURL: '/',

  // Set paths for third-party libraries as modules
  paths: {
    'angular': 'bower_components/angular/angular.js',
    'angular-route': 'bower_components/angular-route/angular-route.js',
    'angular-bootstrap': 'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
    'async': 'bower_components/async/dist/async.js',
    'socket.io-client': 'bower_components/socket.io-client/socket.io-client-1.3.7/socket.io.js'
  }
});
