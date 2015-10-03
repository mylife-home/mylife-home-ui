'use strict';

const irc    = require('irc');
const log4js = require('log4js');
const logger = log4js.getLogger('net.client');

class Client {
  constructor(netConfig, nick, channel) {
    if(channel[0] !== '#') {
      channel = '#' + channel;
    }
    const opt = {
      server      :netConfig.host,
      port        : netConfig.port,
      autoRejoign : true,
      channels    : [channel],
      nick        : nick,
      userName    : nick,
      realName    : 'Mylife Home UI'
    };
    this._irc = new irc.Client(null, null, opt);

    this._irc.on('error', message => logger.error('IRC error: ' + JSON.stringify(message)));

    const self = this;
    this._irc.on('names',(c, u) => self._list(Object.keys(u)));
    this._irc.on('join', (c, n) => self._add(n));
    this._irc.on('nick', this._change.bind(this));
    this._irc.on('part', (c, n) => self._remove(n));
    this._irc.on('kick', (c, n) => self._remove(n));
    this._irc.on('kill', this._remove.bind(this));
    this._irc.on('quit', this._remove.bind(this));

    // admin
    //this._irc.on('message', null);
  }

  _list(users) {
    logger.info('list', users);
  }

  _add(nick) {
    logger.info('add', nick);
  }

  _remove(nick) {
    logger.info('remove', nick);
  }

  _change(oldNick, newNick) {
    logger.info('change', oldNick, newNick);
  }

  close(callback) {
    this._irc.disconnect('Closing', callback);
    this._irc = null;
  }
}

module.exports = Client;