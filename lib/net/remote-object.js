'use strict';

const EventEmitter = require('events').EventEmitter;

class RemoteObject extends EventEmitter {
  constructor(id) {
    super();
    this._id = id;
  }

  get id() {
    return this._id;
  }
}

module.exports = RemoteObject;