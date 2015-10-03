'use strict';

const EventEmitter = require('events');
const log4js       = require('log4js');
const RemoteObject = require('./remote-object');
const logger       = log4js.getLogger('Net.Repository');

class Repository extends EventEmitter {
  constructor(irc) {
    super();

    this._selfNick = irc.opt.nick;
    this._objects = new Map();

    const self = this;
    irc.on('names',(c, u) => self._reset(Object.keys(u)));
    irc.on('join', (c, n) => self._add(n));
    irc.on('nick', self._change.bind(self));
    irc.on('part', (c, n) => self._remove(n));
    irc.on('kick', (c, n) => self._remove(n));
    irc.on('kill', self._remove.bind(self));
    irc.on('quit', self._remove.bind(self));
  }

  _reset(nicks) {
    this._clear();
    for(let nick of nicks) {
      if(nick === this._selfNick) { continue; }
      this._add(nick);
    }
  }

  _clear() {
    this._objects.clear();
    this.emit('clear');
  }

  _add(nick) {
    const obj = new RemoteObject(nick, this);
    this._objects.set(obj.id, obj);
    this.emit('add', obj.id, obj);
  }

  _remove(nick) {
    const id = RemoteObject.getIdFromNick(nick);
    this._object.delete(id);
    this.emit('remove', id);
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

module.exports = Repository;