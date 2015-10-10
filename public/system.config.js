// Configure module loader
System.config({
  baseURL: '/',

  // Set paths for third-party libraries as modules
  paths: {
    'angular': 'bower_components/angular/angular.js',
    'angular-route': 'bower_components/angular-route/angular-route.js',
    'socket.io-client': 'bower_components/socket.io-client/socket.io.js'
  }
});
