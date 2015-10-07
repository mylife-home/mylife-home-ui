'use strict';

const path = require('path');
const Builder = require('systemjs-builder');

const publicDirectory = path.resolve(path.join(__dirname, '../public'));

// optional constructor options
// sets the baseURL and loads the configuration file
const builder = new Builder(publicDirectory, path.join(publicDirectory, 'system.config.js'));

builder
.buildStatic(path.join(publicDirectory, 'app.js'), path.join(publicDirectory, 'bundle.js'), { minify: true })
.then(function() {
  console.log('Build complete');
})
.catch(function(err) {
  console.log('Build error');
  console.log(err);
});
