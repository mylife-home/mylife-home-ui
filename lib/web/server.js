'use strict';

const path             = require('path');
const http             = require('http');
const io               = require('socket.io');
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

    this._server = http.Server(app);
    enableDestroy(this._server);

    const iosrv = io(this._server);
    iosrv.on('connection', function(socket){
      // TODO : http://socket.io/get-started/chat/
      console.log('a user connected');
      socket.on('disconnect', function(){
        console.log('user disconnected');
      });
    });

    this._server.listen(port);
  }

  close(callback) {
    this._server.close(callback);
    this._server.destroy();
  }
};
