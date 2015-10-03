'use strict';

const EventEmitter = require('events');
const log4js       = require('log4js');
const RemoteObject = require('./remote-object');
const logger       = log4js.getLogger('Net.Repository');

class Repository extends EventEmitter {
  constructor(selfNick) {
    super();

    this._selfNick = selfNick;
    this._objects = new Map();
  }

  reset(nicks) {
    this.clear();
    for(let nick of nicks) {
      if(nick === this._selfNick) { continue; }
      this.add(nick);
    }
  }

  clear() {
    this._objects.clear();
    this.emit('clear');
  }

  add(nick) {
    const obj = new RemoteObject(nick, this);
    this._objects.set(obj.id, obj);
    this.emit('add', obj.id, obj);
  }

  remove(nick) {
    const id = RemoteObject.getIdFromNick(nick);
    this._object.delete(id);
    this.emit('remove', id);
  }

  change(oldNick, newNick) {
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