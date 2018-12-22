
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
    const request = (method, endpoint, body = {}) => this.core.request(
      this.core.url(endpoint),
      {method, body},
      'json'
    );

    this.core.singleton('skylark/config', () => ({
      set: config => request('POST', '/skylark/config', conig),
      get: () => request('GET', '/skylark/config')
    }));

    this.core.singleton('skylark/odnn', () => ({
      status: () => request('GET', '/skylark/ondd')
    }));

    this.core.singleton('skylark/command', (name, ...args) => {
      return request('POST', '/skylark/command', {name, args});
    });

    return Promise.resolve();
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
