'use strict';

const EventEmitter = require('events');
const irc          = require('irc');
const log4js       = require('log4js');
const Repository   = require('./repository');
const logger       = log4js.getLogger('Net.Client');

class Client extends EventEmitter {
  constructor(netConfig, nick, channel) {
    super();
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
    this._repository = new Repository(nick);
    this._channel = channel;

    this._irc.on('error', message => logger.error('IRC error: ' + JSON.stringify(message)));

    const repo = this._repository;
    this._irc.on('names',(c, u) => repo.reset(Object.keys(u)));
    this._irc.on('join', (c, n) => repo.add(n));
    this._irc.on('nick', repo.change.bind(repo));
    this._irc.on('part', (c, n) => repo.remove(n));
    this._irc.on('kick', (c, n) => repo.remove(n));
    this._irc.on('kill', repo.remove.bind(repo));
    this._irc.on('quit', repo.remove.bind(repo));

    // debug
    this._irc.on('message', function() {
      const objects = {};
      for(let id of repo.objects) {
        objects[id] = repo.object(id).properties;
      }
      logger.info(objects);
    });
    // ---
  }

  close(callback) {
    this._irc.disconnect('Closing', callback);
    this._irc = null;
  }

  action(id, name, args) {
    this._irc.say(this._channel, id + ' ' + name + ' ' + args.join(' '));
  }

  get repository() {
    return his._repository;
  }
}

module.exports = Client;