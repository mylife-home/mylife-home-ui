'use strict';

const EventEmitter = require('events');
const irc          = require('irc');
const log4js       = require('log4js');
const logger       = log4js.getLogger('Net.Client');
const RemoteObject = require('./remote-object');

class Client extends EventEmitter {
  constructor(netConfig, nick, channel) {
    super();
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

    // debug
    this._irc.on('message', function() {
      const objects = {};
      for(let id of self.objects) {
        objects[id] = self.object(id).properties;
      }
      logger.info(objects);
    });
    // ---

    this._objects = new Map();
  }

  close(callback) {
    this._irc.disconnect('Closing', callback);
    this._irc = null;
  }

  _list(nicks) {
    this._objects.clear();
    this.emit('clear');

    for(let nick of nicks) {
      if(nick === this._irc.nick) { continue; }
      this._add(nick);
    }
  }

  _add(nick) {
    const obj = new RemoteObject(nick, this);
    this._objects.set(obj.id, obj);
    this.emit('add', obj.id);
  }

  _remove(nick) {
    const id = RemoteObject.getIdFromNick(nick);
    this._object.delete(id);
    this.emit('remove', obj.id);
  }

  _change(oldNick, newNick) {
    const id = RemoteObject.getIdFromNick(oldNick);
    const obj = this._objects.get(id);
    obj.change(newNick);
  }

  get objects() {
    const keys = [];
    for(let key of this._objects.keys()) {
      keys.push(key);
    }
    return keys;
  }

  object(id) {
    return this._objects.get(id);
  }
}

module.exports = Client;