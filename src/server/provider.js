const {SkylarkConfiguration} = require('./lib/config.js');
const {SkylarkTelemetry} = require('./lib/telemetry.js');

class SkylarkServiceProvider {

  constructor(core, options = {}) {
    this.core = core;
    this.options = options;
    this.config = new SkylarkConfiguration();
    this.telemetry = new SkylarkTelemetry();
  }

  provides() {
    return [
    ];
  }

  init() {
    this.core.on('init', () => this.registerRoutes());

    return Promise.all([
      this.config.init(),
      this.telemetry.init()
    ]);
  }

  registerRoutes() {
    const {routeAuthenticated} = this.core.make('osjs/express');

    routeAuthenticated('GET', '/skylark/tuner/config', (req, res) => {
      return this.config.get()
        .then(json => res.json(json))
        .catch(error => res.status(500).json({error}));
    }, ['admin']);

    routeAuthenticated('POST', '/skylark/tuner/config', (req, res) => {
      return this.config.set(req.body)
        .then(json => res.json(json))
        .catch(error => res.status(500).json({error}));
    }, ['admin']);

    routeAuthenticated('GET', '/skylark/tuner/ondd', (req, res) => {
    });
  }

  start() {
  }

  destroy() {
  }

}

module.exports = {SkylarkServiceProvider};
