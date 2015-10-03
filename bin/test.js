const Net = require('../lib/net');

const netConfig = {
  host : 'rpi2-devel.mti-team2.dyndns.org',
  port : 6667
};

var client = new Net.Client(netConfig, 'test-js', 'mylife-ui');

process.on('SIGINT', function() {
  client.close(function() {
    process.exit();
  });
});
