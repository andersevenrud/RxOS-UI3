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
  SelectField,
  listView
} from '@osjs/gui';

const register = (core, args, options, metadata) => {
  const proc = core.make('osjs/application', {args, options, metadata});

  const render = $content => {
    const hyperapp = app({
      beam: listView.state({
        columns: ['Region', 'Frequenzy', 'Beam Type']
      }),
      status: listView.state({}),
    }, {
      beam: listView.actions({}),
      status: listView.actions({})
    }, (state, actions) => {
      const BeamParameters = listView.component(state.beam, actions.beam);
      const Status = listView.component(state.status, actions.status);

      const tabs = [
        h(Box, {grow: 1, shrink: 1}, [
          h(SelectField),

          h(BeamParameters, {box: {grow: 1, shrink: 1}}),

          h(SelectField),

          h(Toolbar, {justify: 'flex-end'}, [
            h(Button, {}, 'Apply')
          ])
        ]),

        h(Box, {grow: 1, shrink: 1}, [
          h(Box, {margin: false}, [
            h(BoxContainer, {}, 'Frequenzy (GHz)'),
            h(TextField),

            h(BoxContainer, {}, 'Beam Type'),
            h(TextField)
          ])
        ]),

        h(Box, {grow: 1, shrink: 1}, [
          h(SelectField),
        ]),

        h(Box, {grow: 1, shrink: 1}, [
          h(Status, {box: {grow: 1, shrink: 1}})
        ])
      ];

      return h(Box, {}, [
        h(Tabs, {
          box: {grow: 1, shrink: 1},
          labels: ['Sattelite', 'Custom', 'LNB', 'Status']
        }, tabs)
      ]);
    }, $content);
  };

  proc.createWindow({
    id: 'TunerWindow',
    icon: proc.resource(metadata.icon),
    title: metadata.title.en_EN,
    dimension: {width: 400, height: 300}
  })
    .on('destroy', () => proc.destroy())
    .render(render);

  return proc;
};

osjs.register(applicationName, register);
