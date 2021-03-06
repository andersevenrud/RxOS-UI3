import osjs from 'osjs';
import {h, app} from 'hyperapp';
import {Box, listView} from '@osjs/gui';
import {name as applicationName} from './metadata.json';

const mapRow = iter => {
  const split = iter.trim().split(',');
  const [ts, source] = split;

  if (!['Twitter', 'APRSAT'].indexOf(source) === -1) {
    return false;
  }

  const ts_date = new Date(ts * 1000);
  if (!ts_date.getYear()) {
    return false;
  }

  let message = split.slice(2).join(',');
  let name_tag = '';

  if (source == 'Twitter') {
    const m_parts = message.split(',');

    message = m_parts.slice(1).join(',');
    name_tag = `@${m_parts[0]} on Twitter`
  } else if (source == 'APRSAT') {
    name_tag = `${message.split('>')[0]} via APRS`;
  }

  return {
    colums: [
      ts_date.toLocaleDateString(),
      ts_date.toLocaleTimeString(),
      name_tag,
      message
    ],
    data: iter
  };
};

const register = (core, args, options, metadata) => {
  const proc = core.make('osjs/application', {args, options, metadata});
  const {exec} = core.make('osjs/proc');
  const config = core.make('skylark/config');

  let updateInterval;

  const poll = () => {
    const next = () => {
      updateInterval = setTimeout(() => poll(), 120000);
    };

    const command = config.get('cmds.getMessages');
    exec(command.cmd, command.args)
      .then(({stdout}) => {
        const lines = String(stdout).trim().split('\n');

        const rows = lines
          .map(line => line.split(','))
          .map(mapRow)
          .filter(iter => iter !== false);

        proc.emit('update-list', rows);
        next();
      })
      .catch(error => {
        console.warn(error);
        next();
      });
  };

  proc.createWindow({
    id: 'MessagingWindow',
    icon: proc.resource(metadata.icon),
    title: metadata.title.en_EN,
    dimension: {width: 400, height: 200}
  })
    .on('destroy', () => proc.destroy())
    .on('destroy', () => clearTimeout(updateInterval))
    .on('render', () => poll())
    .render($content => {
      app({
        messages: listView.state({
          columns: ['Date', 'Time', 'From', 'Message']
        })
      }, {
        messages: listView.actions({

        })
      }, (state, actions) => {
        const Messages = listView.component(state.messages, actions.messages);

        return h(Box, {grow: 1, shrink: 1}, [
          h(Messages, {box: {grow: 1, shrink: 1}})
        ]);
      }, $content);

      proc.on('update-list', rows => hyperapp.messages.setRows(rows));
    });

  return proc;
};

osjs.register(applicationName, register);
