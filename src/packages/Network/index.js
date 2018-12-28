import osjs from 'osjs';
import {h, app} from 'hyperapp';
import {name as applicationName} from './metadata.json';

import {
  Box,
  BoxContainer,
  Button,
  Tabs,
  Toolbar,
  TextField,
  ToggleField,
  SelectField
} from '@osjs/gui';

const networkView = (state, actions) => ([
  h(BoxContainer, {}, 'Hostname'),
  h(TextField, {
    value: state.network.hostname,
    onchange: (ev, value) => actions.setNetwork({hostname: value})
  }),

  h(BoxContainer, {}, 'Change "othernet" user password'),
  h(TextField, {
    type: 'password',
    placeholder: 'Leave blank for no change'
  }),

  h(BoxContainer, {}, 'WiFi Mode'),
  h(SelectField, {
    value: state.network.wifiMode,
    choices: state.network.wifiModes,
    onchange: (ev, value) => actions.setNetwork({wifiMode: value})
  })
]);

const hotspotView = (state, actions) => ([
  h(BoxContainer, {}, 'Hotspot Name'),
  h(TextField, {
    value: state.hotspot.ssid,
    onchange: (ev, value) => actions.setHotspot({ssid: value})
  }),

  h(BoxContainer, {}, 'Do not show in scan lists'),
  h(ToggleField, {
    checked: state.hotspot.hidden,
    onchange: (ev, value) => actions.setHotspot({hidden: value})
  }),

  h(BoxContainer, {}, 'Country'),
  h(SelectField, {
    value: state.hotspot.country,
    onchange: (ev, value) => actions.setHotspot({country: value})
  }),

  h(BoxContainer, {}, 'Channel'),
  h(SelectField, {
    choices: state.hotspot.channels,
    value: state.hotspot.channel,
    onchange: (ev, value) => actions.setHotspot({channel: value})
  }),

  h(BoxContainer, {}, 'Enable Security (WPA)'),
  h(ToggleField, {
    checked: state.hotspot.security,
    onchange: (ev, value) => actions.setHotspot({security: value})
  }),

  h(BoxContainer, {}, 'Password (PSK) (minimum 8 chars)'),
  h(TextField, {
    disabled: !state.hotspot.security,
    type: 'password'
  }),
]);

const wifiView = (state, actions) => ([
  h(BoxContainer, {}, 'Access Point Name'),
  h(TextField, {
    value: state.wifi.ssid,
    onchange: (ev, value) => actions.setWifi({ssid: value})
  }),

  h(BoxContainer, {}, 'Password'),
  h(TextField, {
    type: 'password'
  }),
]);

const render = (core, proc) => $content => {
  const skylarkConfig = core.make('skylark/config');
  const config = skylarkConfig.get('netConf'); // FIXME: Update on global

  const inner = children => h(Box, {
    grow: 1,
    shrink: 1,
    margin: false,
    style: {
      overflow: 'auto'
    }
  }, children);

  const view = (state, actions) => h(Box, {grow: 1, shrink: 1}, [
    h(Tabs, {
      labels: ['Network Mode', 'Hotspot Config', 'Wifi Client'],
      box: {
        grow: 1,
        shrink: 1
      }
    }, [
      inner(networkView(state, actions)),
      inner(hotspotView(state, actions)),
      inner(wifiView(state, actions))
    ]),
    h(Toolbar, {align: 'flex-end', justify: 'flex-end'}, [
      h(Button, {
        onclick: () => actions.save()
      }, 'Apply & Restart')
    ])
  ]);

  app({
    network: {
      wifiMode: config.mode,
      wifiModes: Object.values(config.modes),
      hostname: config.hostname
    },
    hotspot: {
      ssid: config.ap.ssid,
      hidden: config.ap.hidden,
      country: config.ap.selectedCountry,
      channel: config.ap.selectedChannel,
      channels: config.ap.channels,
      security: config.ap.securityEnabled
    },
    wifi: {
      ssid: ''
    }
  }, {
    setNetwork: obj => state => Object.assign(state.network, obj),
    setHotspot: obj => state => Object.assign(state.hotspot, obj),
    setWifi: obj => state => Object.assign(state.wifi, obj),
    save: () => {}
  }, view, $content);
};

const register = (core, args, options, metadata) => {
  const proc = core.make('osjs/application', {args, options, metadata});

  proc.createWindow({
    id: 'NetworkWindow',
    icon: proc.resource(metadata.icon),
    title: metadata.title.en_EN,
    dimension: {width: 400, height: 200}
  })
    .on('destroy', () => proc.destroy())
    .render(render(core, proc));

  return proc;
};

osjs.register(applicationName, register);
