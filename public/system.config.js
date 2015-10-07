// Configure module loader
System.config({
  baseURL: '/',
  defaultJSExtensions: true,

  // Set paths for third-party libraries as modules
  paths: {
    'angular': 'bower_components/angular/angular.js',
    'angular-route': 'bower_components/angular-route/angular-route.js'
  }
});
