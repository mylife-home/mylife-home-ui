'use strict';

const EventEmitter = require('events');
const os           = require('os');
const async        = require('async');
const Net          = require('./net');
const Web          = require('./web');
const Admin        = require('./admin');

class Session extends EventEmitter {
  constructor(id, socket, netConfig, netRepository) {
    super();

    this._terminating     = false;
    this._socketConnected = true;
    this._id              = id;
    this._socket          = socket;
    this._net             = new Net.Client(netConfig, this._createNick());
    this._netRepository   = netRepository;
    const self            = this;

    this._socket.on('disconnect', () => self._net.close(() => self.emit('close')));
    this._socket.on('action', (data) => this._net.action(data.id, data.name, data.args));

    this._netRepository.on('add', (id, obj) => self._socket.emit('add', { id: id, attributes: self._objAttributes(obj) }));
    this._netRepository.on('remove', (id) => self._socket.emit('remove', { id: id }));
    this._netRepository.on('change', (id, name, value) => self._socket.emit('change', { id: id, name: name, value: value }));

    this._sendState();
  }

  _createNick() {
    return 'ui-session_' + this._id + '_' +
      this._socket.request.connection.remoteAddress.replace(/\./g, '-').replace(/:/g, '-');
  }

  _objAttributes(obj) {
    const attrs = {};
    for(let name of obj.attributes) {
      attrs[name] = obj.attribute(name);
    }
    return attrs;
  }

  _sendState() {
    const data = {};
    for(let id of this._netRepository.objects) {
      const obj = this._netRepository.object(id);
      data[id] = this._objAttributes(obj);
    }
    this._socket.emit('state', data);
  }

  get id() {
    return this._id;
  }

  kill(cb) {
    this.once('close', cb);
    this._socket.disconnect();
  }
}

module.exports = class {
  constructor(netConfig, httpPort) {
    this._netConfig         = netConfig;
    this._netAgent          = new Net.Client(netConfig, 'ui-agent');
    this._netRepository     = new Net.Repository(this._netAgent);
    this._netJPacketManager = new Net.JPacketManager(this._netAgent);
    this._adminClient       = new Admin.Client(netConfig, this._adminNick(), this._createAdminDefinition());
    this._webServer         = new Web.Server(this.netRepository, this._netJPacketManager, this._createSession.bind(this), httpPort);
    this._sessions          = new Map();
    this._idGenerator       = 0;
  }

  _adminNick() {
    let hostname = os.hostname();
    return 'mylife-home-ui_' + os.hostname().split('.')[0];
  }

  _createAdminDefinition() {
    // TODO : create admin def
    return {
      test: {
        desc: 'Test desc',
        impl: (w) => w('test!')
      },
      toto: {
        desc: 'Toto desc',
        children: {
          subToto: {
            desc: 'Sub toto desc',
            impl: (w, m) => w('sub toto => ' + m),
          }
        }
      }
    };
  }

  _createSession(socket) {
    const self = this;
    const id = ++this._idGenerator;
    const session = new Session(id, socket, this._netConfig, this._netRepository);
    this._sessions.set(id, session);
    session.on('close', () => self._sessions.delete(id));
  }

  close(cb) {
    const array = [
      (cb) => this._webServer.close(cb),
      (cb) => this._netAgent.close(cb),
      (cb) => this._adminClient.close(cb)
    ];
    for(let session of this._sessions.values()) {
      array.push((cb) => session.kill(cb));
    }

    async.parallel(array, cb);
  }
};