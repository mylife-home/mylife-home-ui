'use strict';

const path   = require('path');
const common = require('mylife-home-common');
const Server = require('../lib/server');

let configFile = path.join(__dirname, '../conf/config.json');
if(process.argv[2]) { configFile = process.argv[2]; }
configFile = path.resolve(configFile);
const config = require(configFile);

common.logging.init(config);

const server = new Server(config);

function terminate() {
  server.close(() => process.exit());
}

process.on('SIGINT', terminate);
process.on('SIGTERM', terminate);
