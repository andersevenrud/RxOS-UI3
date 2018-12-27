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

const lockStates = ['Search', 'Signal Detect', 'Const Lock', 'Code Lock', 'Frame Lock'];

const createRows = values => ([{
  columns: ['Stream', values.stream],
}, {
  columns: ['SNR (dB)', values.snr],
}, {
  columns: ['Stream', values.stream],
}, {
  columns: ['Lock', values.lock],
}, {
  columns: ['Rssi (dBm)', values.rssi],
}, {
  columns: ['APkMn Ratio', values.alg_pk_mn],
}, {
  columns: ['Frequency (MHz)', values.freq],
}, {
  columns: ['Freq Offset (Hz)', values.freq_offset],
}, {
  columns: ['Freq Offset (post-AFC) (Hz)', values.freq_offset_uc],
}, {
  columns: ['Symbol Error Rate (SER)', values.ser],
}, {
  columns: ['Packets received', values.crc_err],
}, {
  columns: ['Valid packets', values.crc_ok],
}, {
  columns: ['Valid packets %', values.crc_err],
}, {
  columns: ['Packet Error Rate (PER)', values.crc_err],
}, {
  columns: ['dT (ms)', values.td],
}, {
  columns: ['Bitrate (bps)', values.bitrate],
}, {
  columns: ['Packet rate (pps)', values.packetrate],
}, {
  columns: ['Lock State', lockStates[values.state]]
}, {
  columns: ['Audio Frames Received', values.num_frames],
}, {
  columns: ['Audio Frames Played', values.num_frames_played],
}, {
  columns: ['Audio bitrate(bps)', values.audio_bitrate],
}, {
  columns: ['Transfers', values.transfers],
}]);

const createBeamRows = (type, beams) => ([{
  columns: ['Region', beams[type].label]
}, {
  columns: ['Frequency', beams[type].freq]
}, {
  columns: ['Beam Type', beams[type].beamtype]
}]);

const register = (core, args, options, metadata) => {
  const proc = core.make('osjs/application', {args, options, metadata});
  const skylarkConfig = core.make('skylark/config');
  const odnn = core.make('skylark/odnn');
  const onconfigupdate = () => proc.emit('config-updated');
  let pollInterval;

  const poll = () => {
    odnn.status()
      .then(status => {
        proc.emit('status-updated', status);

        pollInterval = setTimeout(() => poll(), 3000);
      })
      .catch(error => {
        console.error(error); // F IXME
      });
  };

  const render = $content => {
    const hyperapp = app({
      beamName: '',
      beamNames: [],
      antennaType: '',
      antennaTypes: [],
      lnbName: '',
      lnbNames: [],
      customFreq: 0,
      customBeam: '',
      beam: listView.state({
        columns: ['Name', 'Value'],
      }),
      status: listView.state({
        columns: ['Name', 'Value'],
        rows: createRows({})
      }),
    }, {
      beam: listView.actions({}),
      status: listView.actions({}),

      save: () => state => {
        skylarkConfig.set({
          tunerConf: {
            selectedBeam: state.beamName,
            selectedAntenna: state.antennaType,
            selectedLNB: state.lnbName,
            beams: {
              custom: {
                freq: state.customFreq,
                beamtype: state.customBeam
              }
            }
          }
        })
      },

      update: config => state => ({
        beamName: config.selectedBeam,
        beamNames: Object.keys(config.beams),

        antennaType: config.selectedAntenna,
        antennaTypes: Object.values(config.antennaTypes)
          .reduce((carry, iter) => Object.assign({
            [iter.value]: iter.label
          }, carry), {}),

        lnbName: config.selectedLNB,
        lnbNames: Object.values(config.LNBs)
          .reduce((carry, iter) => Object.assign({
            [iter.value]: iter.label
          }, carry), {}),

        customFreq: config.beams.custom.freq,
        customBeam: config.beams.custom.beamtype,

        beam: Object.assign(state.beam, {
          rows: createBeamRows(config.selectedBeam, config.beams)
        })
      }),

      setCustomFreq: customFreq => ({customFreq}),
      setCustomBeam: customBeam => ({customBeam}),

      setLNBType: lnbName => ({lnbName}),

      setAntennaType: antennaType => ({antennaType}),

      setBeamType: beamName => (state, actions) => {
        const config = skylarkConfig.get('tunerConf');

        actions.beam.setRows(createBeamRows(beamName, config.beams));

        return {beamName};
      },
    }, (state, actions) => {
      const BeamParameters = listView.component(state.beam, actions.beam);
      const Status = listView.component(state.status, actions.status);

      const tabs = [
        h(Box, {grow: 1, shrink: 1}, [
          h(SelectField, {
            choices: state.beamNames,
            value: state.beamName,
            onchange: (ev, value) => actions.setBeamType(value)
          }),

          h(BeamParameters, {box: {grow: 1, shrink: 1}}),

          h(SelectField, {
            choices: state.antennaTypes,
            value: state.antennaType,
            onchange: (ev, value) => actions.setAntennaType(value)
          }),

          h(Toolbar, {justify: 'flex-end'}, [
            h(Button, {
              onclick: () => actions.save()
            }, 'Apply')
          ])
        ]),

        h(Box, {grow: 1, shrink: 1}, [
          h(Box, {margin: false}, [
            h(BoxContainer, {}, 'Frequenzy (GHz)'),
            h(TextField, {
              value: state.customFreq,
              type: 'number',
              onchange: (ev, value) => actions.setCustomFreq(value)
            }),

            h(BoxContainer, {}, 'Beam Type'),
            h(TextField, {
              value: state.customBeam,
              type: 'number',
              onchange: (ev, value) => actions.setCustomBeam(value)
            }),
          ])
        ]),

        h(Box, {grow: 1, shrink: 1}, [
          h(SelectField, {
            choices: state.lnbNames,
            value: state.lnbName,
            onchange: (ev, value) => actions.setLNBType(value)
          }),
        ]),

        h(Box, {grow: 1, shrink: 1}, [
          h(Status, {box: {grow: 1, shrink: 1}})
        ])
      ];

      return h(Box, {grow: 1, shrink: 1}, [
        h(Tabs, {
          box: {grow: 1, shrink: 1},
          labels: ['Sattelite', 'Custom', 'LNB', 'Status']
        }, tabs)
      ]);
    }, $content);

    proc.on('status-updated', status => {
      hyperapp.status.setRows(createRows(status));
    });

    proc.on('config-updated', () => {
      const config = skylarkConfig.get('tunerConf');
      hyperapp.update(config);
    });

    proc.emit('config-updated');
  };

  proc.on('destroy', () => clearTimeout(pollInterval));

  proc.createWindow({
    id: 'TunerWindow',
    icon: proc.resource(metadata.icon),
    title: metadata.title.en_EN,
    dimension: {width: 400, height: 300}
  })
    .on('destroy', () => proc.destroy())
    .on('render', () => poll())
    .render(render);

  core.on('skylark/config:update', onconfigupdate);
  proc.on('destroy', () => core.off('skylark/config:update', onconfigupdate));

  return proc;
};

osjs.register(applicationName, register);
