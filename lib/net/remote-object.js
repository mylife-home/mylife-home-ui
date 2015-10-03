'use strict';

const log4js       = require('log4js');
const logger       = log4js.getLogger('Net.RemoteObject');

class RemoteObject {
  constructor(nick, emitter) {
    const data       = RemoteObject._parseNick(nick);
    this._emitter    = emitter;
    this._id         = data.id;
    this._properties = data.properties;
  }

  static getIdFromNick(nick) {
    return RemoteObject._parseNick(nick).id;
  }

  static _parseNick(nick) {
    const parts = nick.split('|');
    const ret = {
      id         : parts[0],
      properties : {}
    };
    parts.shift();
    for(let part of parts) {
      const items = part.split('`');
      ret.properties[items[0]] = items[1];
    }
    return ret;
  }

  change(newNick) {
    const data = RemoteObject._parseNick(newNick);
    if(data.id !== this._id) {
      logger.error('object \'' + this._id + '\' has changed id to \'' + data.id + '\', ignoring (but this leads to sync problems)');
    }

    for(let name of Object.keys(this._properties)) {
      const oldValue = this._properties[name];
      const newValue = data.properties[name];
      if(newValue === undefined) {
        logger.error('object \'' + this._id + '\' has lost property \'' + name + '\', ignoring (but this leads to sync problems)');
        continue;
      }

      if(oldValue !== newValue) {
        this._properties[name] = newValue;
        this._emitter.emit('change', this._id, name, newValue);
      }
    }

  }

  get id() {
    return this._id;
  }

  get properties() {
    return Object.keys(this._properties);
  }

  property(name) {
    return this._properties[name];
  }
}

module.exports = RemoteObject;