'use strict';

const EventEmitter = require('events');
const irc          = require('irc');
const log4js       = require('log4js');
const logger       = log4js.getLogger('Net.Admin');

class Client {
  constructor(netConfig, nick) {
    let channel = netConfig.admin_channel;
    if(channel[0] !== '#') {
      channel = '#' + channel;
    }
    const opt = {
      server      : netConfig.host,
      port        : netConfig.port,
      autoRejoign : true,
      channels    : [channel],
      nick        : nick,
      userName    : nick,
      realName    : 'Mylife Home UI'
    };
    this._irc = new irc.Client(null, null, opt);
    this._channel = channel;

    this._irc.on('error',    message => logger.error('IRC error: ' + JSON.stringify(message)));
    this._irc.on('netError', message => logger.error('Network error: ' + JSON.stringify(message)));

    const self = this;
    this._irc.on('message', self._message.bind(self));
  }

  close(callback) {
    this._irc.disconnect('Closing', callback);
    this._irc = null;
  }

  _message(from, to, text) {
    // TODO
    this._irc.notice(from, text);
  }
}

module.exports = Client;