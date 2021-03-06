const {SkylarkConfiguration} = require('./lib/config.js');
const {SkylarkTelemetry} = require('./lib/telemetry.js');
const {SkylarkOndd} = require('./lib/ondd.js');

class SkylarkServiceProvider {

  constructor(core, options = {}) {
    this.core = core;
    this.options = options;
    this.config = new SkylarkConfiguration(core);
    this.telemetry = new SkylarkTelemetry(core);
    this.odnn = new SkylarkOndd(core);
  }

  provides() {
    return [
    ];
  }

  init() {
    this.registerRoutes();

    return Promise.all([
      this.telemetry.init(),
      this.config.init(),
      this.odnn.init()
    ]);
  }

  registerRoutes() {
    const {routeAuthenticated} = this.core.make('osjs/express');

    routeAuthenticated('get', '/skylark/config', (req, res) => {
      return this.config.get()
        .then(json => res.json(json))
        .catch(error => res.status(500).json({error}));
    }, ['admin']);

    routeAuthenticated('post', '/skylark/config', (req, res) => {
      return this.config.set(req.body)
        .then(json => res.json(json))
        .catch(error => res.status(500).json({error}));
    }, ['admin']);

    routeAuthenticated('get', '/skylark/ondd', (req, res) => {
      return this.odnn.status()
        .then(json => res.json(json))
        .catch(error => res.status(500).json({error}));
    });
  }

  start() {
  }

  destroy() {
  }

}

module.exports = {SkylarkServiceProvider};
