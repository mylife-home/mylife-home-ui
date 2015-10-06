'use strict';

// jrequest : id, type
// jresponse : id, type
// jres_data(jresponse) : data
// jres_error(jresponse) : message
// jres_success(jresponse)
// jreq_enum(jrequest)
// jreq_get(jrequest) : key
// jreq_set(jrequest) : key, value
// jres_success::type_def = "success";
// jres_error::type_def = "error";
// jreq_enum::type_def = "enum";
// jreq_enum::response_type_def = "rs_enum";
// jreq_get::type_def = "get";
// jreq_get::response_type_def = "rs_get";
// jreq_set::type_def = "set";
// jreq_set::response_type_def = "rs_set";

// format irc :
// jpacket init <id> <data count>
// jpacket data <id> <data1>
// jpacket data <id> <data2>
// expiration du paquet si au bout de 30 secondes il n'a plus été mis à jour et n'est pas terminé

// max msg : 512 chars. On compte 150 pour nick + command, il reste 362. on prend 300 comme marge (si le nick est plus long plus tard mettons ...)

const log4js       = require('log4js');
const logger       = log4js.getLogger('Net.JPacketManager');

class PendingPacket {
  constructor(id, expectedCount, cb, terminatedCb) {
    this._id           = id;
    this._cb           = cb;
    this._buffer       = '';
    this._total        = expectedCount;
    this._count        = 0;
    this._terminatedCb = terminatedCb;
    this._resetTimeout();
  }

  data(raw) {
    this._resetTimeout();
    this._buffer += raw;
    if(++this._count === this._total) {
      let obj;
      try {
        obj = JSON.parse(this._buffer);
      }
      catch(err) {
        logger.error(this._id, err);
        return this._end();
      }
      this._end();
      return setImmediate(this._cb, obj.root);
    }
  }

  _resetTimeout() {
    if(this._timeout) { clearTimeout(this._timeout); }
    this._timeout = setTimeout(this._expired.bind(this), 30000);
  }

  _expired() {
    logger.error(this._id, 'timeout');
    this._end();
  }

  _end() {
    clearTimeout(this._timeout);
    this._terminatedCb(this._id);
  }
}

class PendingExecute {
  constructor(id, cb, terminatedCb) {
    this._id           = id;
    this._cb           = cb;
    this._terminatedCb = terminatedCb;
    this._resetTimeout();
  }

  data(res) {
    setImmediate(this._cb, undefined, res);
    this._end();
  }

  _resetTimeout() {
    if(this._timeout) { clearTimeout(this._timeout); }
    this._timeout = setTimeout(this.error.bind(this, 'TIMEOUT'), 30000);
  }

  error(err) {
    setImmediate(this._cb, err);
    this._end();
  }

  _end() {
    clearTimeout(this._timeout);
    this._terminatedCb(this._id);
  }
}

module.exports = class {
  constructor(client) {
    this._irc             = client.irc;
    this._idGenerator     = 0;
    this._pendingPackets  = new Map();
    this._pendingExecutes = new Map();
    this._resourcesNick   = client.netConfig.resources_nick;

    client.irc.on('disconnect', this._onDisconnect.bind(this));
    client.irc.on('message',    this._onMessage.bind(this));
  }

  _send(msg) {
    this._irc.say(this._resourcesNick, msg);
  }

  _packetReady(data) {
    if(!data.id) { return logger.error(data); }
    this._pendingExecutes.get(data.id).data(data);
  }

  _packetEnd(id) {
    this._pendingPackets.delete(id);
  }

  _executeEnd(id) {
    this._pendingExecutes.delete(id);
  }

  _onDisconnect() {
    this._pendingPackets.clear();

    while(this._pendingExecutes.length) {
      let key = this._pendingPackets.keys().next().value;
      this._pendingExecutes.get(key).error('DISCONNECTED');
    }
  }

  _onMessage(from, to, text) {
    if(!from.startsWith(this._resourcesNick)) { return; }
    if(to.startsWith('#')) { return; }

    const arr = text.split(' ');
    if(arr.length < 4) { return; }
    if(arr.shift() !== 'jpacket') { return; }

    const cmd     = arr.shift();
    const id      = arr.shift();
    const payload = arr.join(' ');

    if(cmd === 'init') {
      let pending = new PendingPacket(
        id,
        parseInt(payload),
        this._packetReady.bind(this),
        this._packetEnd.bind(this));

      this._pendingPackets.set(id, pending);
    }
    else if(cmd === 'data') {
      let pending = this._pendingPackets.get(id);
      if(!pending) { return; }
      pending.data(payload);
    }
  }

  execute(req, cb) {
    const self = this;
    const id   = (++this._idGenerator).toString();

    req.id = id;
    const data = JSON.stringify({root: req}).match(/.{1,300}/g);
    this._send(`jpacket init ${id} ${data.length}`);
    data.forEach((it) => self._send(`jpacket data ${id} ${it}`));

    this._pendingExecutes.set(id, new PendingExecute(id, cb, this._executeEnd.bind(this)));
  }

  resourceEnum(cb) {
    return this.execute({
      type : 'enum'
    }, (err, res) => {
      if(err) { return cb(err); }
      if(res.type === 'error') { return cb(res.message); }
      return cb(undefined, res.data);
    });
  }

  resourceGet(key, cb) {
    return this.execute({
      type : 'get',
      key  : key
    }, (err, res) => {
      if(err) { return cb(err); }
      if(res.type === 'error') { return cb(res.message); }
      return cb(undefined, res.data);
    });
  }
};