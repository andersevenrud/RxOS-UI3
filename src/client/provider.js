import simplejsonconf from 'simplejsonconf';

export class SkylarkServiceProvider {

  constructor(core, options = {}) {
    this.core = core;
    this.options = options;
    this.tray = null;
  }

  provides() {
    return [
      'skylark/config',
      'skylark/odnn',
      'skylark/command'
    ];
  }

  init() {
    let configCache;

    const request = (method, endpoint, body = {}) => this.core.request(
      this.core.url(endpoint),
      {method, body},
      'json'
    );

    this.core.singleton('skylark/config', () => ({
      set: config => {
        return request('POST', '/skylark/config', config)
          .then(json => {
            configCache = json;

            core.emit('skylark/config:update');
          });
      },

      get: (key, defaultValue) => {
        return simplejsonconf(configCache)
          .get(key, defaultValue);
      }
    }));

    this.core.singleton('skylark/odnn', () => ({
      status: () => request('GET', '/skylark/ondd')
    }));

    return request('GET', '/skylark/config')
      .then(json => (configCache = json));
  }

  start() {
    if (this.core.has('osjs/tray')) {
      const {icon} = this.core.make('osjs/theme');

      this.tray = this.core.make('osjs/tray', {
        title: 'Skylark',
        icon: icon('network-offline')
      });
    }
  }

  destroy() {
    if (this.tray) {
      this.tray.destroy();
    }

    this.tray = null;
  }
}
