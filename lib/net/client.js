'use strict';

const irc = require('irc');

class Client {
  constructor(netConfig, nick, joinAdmin) {
    opt = {
      server      :netConfig.host,
      port        : netConfig.port,
      autoRejoign : true,
      channels    : joinAdmin ? [netConfig.ui_channel, netConfig.admin_channel] : [netConfig.ui_channel],
      nick        : nick,
      userName    : nick,
      realName    : 'Mylife Home UI'
    };
    this._irc = new irc.Client(null, null, opt);
  }

  close(callback) {
    this._irc.disconnect('Closing', callback);
  }
}

module.exports = Client;