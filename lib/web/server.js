'use strict';

const path             = require('path');
const express          = require('express');
const enableDestroy    = require('server-destroy');
const bodyParser       = require('body-parser');
const favicon          = require('serve-favicon');
const serveStatic      = require('serve-static');
const createRepository = require('./repository');
const createResources  = require('./resources');

module.exports = class {
  constructor(netRepository, netJPacketManager, port) {
    const app = express();
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    const publicDirectory = path.resolve(path.join(__dirname, '../../public'));

    app.use(favicon(path.join(publicDirectory, 'favicon.ico')));
    app.use('/repository', createRepository(netRepository));
    app.use('/resources', createResources(netJPacketManager));
    app.use(serveStatic(publicDirectory));

    // TODO : socket.io


    this._server = app.listen(port);
    enableDestroy(this._server);
  }

  close(callback) {
    this._server.close(callback);
    this._server.destroy();
  }
};
