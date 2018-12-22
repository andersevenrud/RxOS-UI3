const dgram = require('unix-dgram');

class SkylarkOndd {
  constructor(core, callback) {
    this.socket = null;
    this.store = {};
    this.callback = callback || function () {};
  }

  init() {
    this.socket = dgram.createSocket('unix_dgram', d => {
      this.store = Object.assign({}, this.store, JSON.parse(d));

      this.callback(this.store);
    });

    return Promise.resolve();
  }

  status() {
    return Promise.resolve(this.store);
  }
}

module.exports = {SkylarkOndd};
