import osjs from 'osjs';
import {h, app} from 'hyperapp';
import {name as applicationName} from './metadata.json';

import {
  Box,
  Panes,
  Iframe,
  listView
} from '@osjs/gui';

const createRows = list => list
  .filter(file => file.filename.substr(0, 1) !== '.')
  .map(data => ({
      columns: [
        data.filename
          .split('.')
          .slice(0, -1)
          .join('.')
          .replace(/_/g, ' ')
      ],
      data
  }));

const register = (core, args, options, metadata) => {
  const proc = core.make('osjs/application', {args, options, metadata});
  const {url, readdir} = core.make('osjs/vfs');

  const render = $content => {
    const hyperapp = app({
      currentUrl: '',
      listView: listView.state({
        zebra: false,
        columns: ['Filename']
      })
    }, {
      setUrl: currentUrl => ({currentUrl}),
      listView: listView.actions({
        select: ({data}) => proc.emit('render-file', data)
      })
    }, (state, actions) => {
      const SideView = listView.component(state.listView, actions.listView);

      return h(Box, {}, [
        h(Panes, {
          box: {grow: 1, shrink: 1},
          sizes: [150]
        }, [
          h(SideView, {
            box: {grow: 1, shrink: 1}
          }),
          h(Iframe, {
            class: 'osjs-gui-box-styled',
            box: {grow: 1, shrink: 1},
            src: state.currentUrl
          })
        ])
      ]);
    }, $content);

    proc.on('render-file', file => {
      url(file)
        .then(uri => hyperapp.setUrl(uri))
        .catch(error => console.warn(error));
    });

    proc.on('render-list', list => hyperapp.listView.setRows(createRows(list)));
  };

  const init = () => {
    proc.on('load-files', () => {
      readdir({path: 'downloads:/Wikipedia'}, {filter: iter => iter.mime === 'text/html'})
        .then(list => proc.emit('render-list', list))
        .catch(error => console.warn(error));
    });

    let interval = setInterval(() => {
      proc.emit('load-files');
    }, 2 * 60 * 1000); // 2 minutes

    proc.on('destroy', () => clearInterval(interval));

    proc.emit('load-files');
  };

  proc.createWindow({
    id: 'WikipediaWindow',
    icon: proc.resource(metadata.icon),
    title: metadata.title.en_EN,
    dimension: {width: 400, height: 200}
  })
    .on('destroy', () => proc.destroy())
    .on('render', init)
    .render(render);

  return proc;
};

osjs.register(applicationName, register);
