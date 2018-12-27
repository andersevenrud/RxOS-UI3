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
    value: state.network.hostname
  }),

  h(BoxContainer, {}, 'Change "othernet" user password'),
  h(TextField, {
    type: 'password',
    placeholder: 'Leave blank for no change'
  }),

  h(BoxContainer, {}, 'WiFi Mode'),
  h(SelectField, {
    value: state.network.wifiMode,
    choices: state.network.wifiModes
  }),

  h(Toolbar, {align: 'flex-end', justify: 'flex-end'}, [
    h(Button, {
      onclick: () => actions.applyNetwork()
    }, 'Apply & Restart')
  ])
]);

const hotspotView = (state, actions) => ([
]);

const wifiView = (state, actions) => ([
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
    ])
  ]);

  app({
    network: {
      wifiMode: config.mode,
      wifiModes: Object.values(config.modes),
      hostname: config.hostname
    },
    hotspot: {

    },
    wifi: {

    }
  }, {
    applyNetwork: () => {}
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
