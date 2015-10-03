'use strict';

const EventEmitter = require('events');
const irc          = require('irc');
const log4js       = require('log4js');
const Repository   = require('./repository');
const logger       = log4js.getLogger('Net.Client');

class Client extends EventEmitter {
  constructor(netConfig, nick) {
    super();

    let channel = netConfig.ui_channel;
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
    this._repository = new Repository(this._irc);
    this._channel = channel;

    this._irc.on('error',    message => logger.error('IRC error: ' + JSON.stringify(message)));
    this._irc.on('netError', message => logger.error('Network error: ' + JSON.stringify(message)));
  }

  close(callback) {
    this._irc.disconnect('Closing', callback);
    this._irc = null;
  }

  action(id, name, args) {
    this._irc.say(this._channel, id + ' ' + name + ' ' + args.join(' '));
  }

  get repository() {
    return this._repository;
  }
}

module.exports = Client;