'use strict';

const express    = require('express');
const bodyParser = require('body-parser');

const createRepository = require('./repository');
const createResources = require('./resources');

module.exports = class {
  constructor(netRepository, netJPacketManager, port) {
    const app = express();
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    app.use('/repository', createRepository(netRepository));
    app.use('/resources', createResources(netJPacketManager));
    // TODO

    this._server = app.listen(port);
  }

  close(callback) {
    this._server.close(callback);
  }
};