class SkylarkConfiguration {
  constructor() {
    this.config = {};
  }

  init() {
    return Promise.resolve();
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
