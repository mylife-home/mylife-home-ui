'use strict';

const path             = require('path');
const EventEmitter     = require('events');
const http             = require('http');
const io               = require('socket.io');
const express          = require('express');
const enableDestroy    = require('server-destroy');
const bodyParser       = require('body-parser');
const favicon          = require('serve-favicon');
const serveStatic      = require('serve-static');
const createRepository = require('./repository');
const createResources  = require('./resources');

module.exports = class extends EventEmitter {
  constructor(netRepository, netJPacketManager, sessionCreator, port) {
    super();
    const app = express();
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    const publicDirectory = path.resolve(path.join(__dirname, '../../public'));

    app.use(favicon(path.join(publicDirectory, 'favicon.ico')));
    app.use('/repository', createRepository(netRepository));
    app.use('/resources', createResources(netJPacketManager));
    app.use(serveStatic(publicDirectory));

    this._server = http.Server(app);
    enableDestroy(this._server);
    io(this._server).on('connection', sessionCreator);

    this._server.listen(port);
  }

  close(callback) {
    this._server.close(callback);
    this._server.destroy();
  }
};