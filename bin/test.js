'use strict';

const async = require('async');
const Net   = require('../lib/net');
const Admin = require('../lib/admin');
const Web   = require('../lib/web');

const netConfig = {
  host           : 'rpi2-devel.mti-team2.dyndns.org',
  port           : 6667,
  ui_channel     : 'mylife-ui',
  admin_channel  : 'mylife-admin',
  resources_nick : 'mylife-home-resources'
};

const adminDefinition = {
  test: {
    desc: 'Test desc',
    impl: (w) => w('test!')
  },
  toto: {
    desc: 'Toto desc',
    children: {
      subToto: {
        desc: 'Sub toto desc',
        impl: (w, m) => w('sub toto => ' + m),
      }
    }
  }
};

var netClient = new Net.Client(netConfig, 'test-js');
var netRepository = new Net.Repository(netClient);
var netJPacketManager = new Net.JPacketManager(netClient);

var adminClient = new Admin.Client(netConfig, 'test-js-admin', adminDefinition);
var webServer = new Web.Server(netRepository, netJPacketManager, 8001);

process.on('SIGINT', () => async.parallel([
    (cb) => webServer.close(cb),
    (cb) => netClient.close(cb),
    (cb) => adminClient.close(cb)
  ],
  () => process.exit()));
