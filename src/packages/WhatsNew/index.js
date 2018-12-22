import osjs from 'osjs';
import {h, app} from 'hyperapp';
import {name as applicationName} from './metadata.json';
import {Box, listView} from '@osjs/gui';

const mapRow = iter => {
  const d = new Date(iter[0] * 1000);
  return {
    labels: [
      d.toLocaleDateString(),
      d.toLocaleTimeString(),
      iter.slice(1).join(',')
    ]
  };
};

const register = (core, args, options, metadata) => {
  const proc = core.make('osjs/application', {args, options, metadata});
  const command = name => core.make('skylark/command', name);

  let updateInterval;

  const poll = () => {
    const next = () => {
      updateInterval = setTimeout(() => poll(), 120000);
    };

    command('whatsNew')
      .then(data => {
        const lines = String(data).trim().split('\n');
        const rows = lines
          .map(line => line.split(','))
          .filter(iter => !!(iter[0] * 1000))
          .map(mapRow);

        proc.on('update-list', rows);
        next();
      })
      .catch(error => {
        console.warn(error);
        next();
      });
  };

  proc.createWindow({
    id: 'WhatsNewWindow',
    icon: proc.resource(metadata.icon),
    title: metadata.title.en_EN,
    dimension: {width: 400, height: 200}
  })
    .on('destroy', () => proc.destroy())
    .on('destroy', () => clearTimeout(updateInterval))
    .on('render', () => poll())
    .render($content => {
      const hyperapp = app({
        listView: listView.state({
          zebra: false,
          columns: ['Date', 'Time', 'File']
        })
      }, {
        listView: listView.actions({
          select: ({data}) => proc.emit('render-file', data)
        })
      }, (state, actions) => {
        const ListView = listView.component(state.listView, actions.listView);

        return h(Box, {}, [
          h(ListView, {box: {grow: 1, shrink: 1}}),
        ]);
      }, $content);

      proc.on('update-list', rows => hyperapp.listView.setRows(rows));
    });

  return proc;
};

osjs.register(applicationName, register);
