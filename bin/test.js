'use strict';

const Server = require('../lib/server');

const netConfig = {
  host           : 'rpi2-devel.mti-team2.dyndns.org',
  port           : 6667,
  ui_channel     : 'mylife-ui',
  admin_channel  : 'mylife-admin',
  resources_nick : 'mylife-home-resources'
};

var server = new Server(netConfig, 8001);

process.on('SIGINT', () => server.close(() => process.exit()));
