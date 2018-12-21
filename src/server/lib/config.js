const fs = require('fs-extra');

class SkylarkConfiguration {
  constructor(core) {
    this.core = core;
    this.config = {};
  }

  init() {
    return fs.readJson(this.core.config('skylark.config.file'))
      .then(config => (this.config = config));
  }

  set(config) {
    this.config = Object.assign({}, this.config, config);

    return this.get();
  }

  get() {
    return Object.assign({}, this.config);
  }
}

module.exports = {SkylarkConfiguration};
