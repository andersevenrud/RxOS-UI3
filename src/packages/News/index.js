import osjs from 'osjs';
import {h, app} from 'hyperapp';
import {name as applicationName} from './metadata.json';

import {
  Box,
  Panes,
  Iframe,
  SelectField,
  listView
} from '@osjs/gui';

const unique = a => a.filter((elem, pos, arr) => arr.indexOf(elem) === pos);

const register = (core, args, options, metadata) => {
  const proc = core.make('osjs/application', {args, options, metadata});
  const {url, readdir} = core.make('osjs/vfs');

  const render = $content => {
    const hyperapp = app({
      currentUrl: '',
      currentChannel: null,
      news: [],
      channels: [],
      articlesView: listView.state({
        zebra: false,
        columns: [{
          label: 'Date',
          style: {
            flex: '0 1 7em'
          }
        }, {
          label: 'Article'
        }]
      }),
    }, {
      setUrl: currentUrl => ({currentUrl}),

      setNews: news => ({
        news,
        channels: unique(news.map(n => n.channel))
      }),

      setChannel: channel => (state, actions) => {
        const rows = state.news
          .filter(data => data.channel === channel)
          .map(data => ({
            columns: [data.date, data.title],
            data: data.file
          }));

        actions.articlesView.setRows(rows);

        return {currentChannel: channel};
      },

      articlesView: listView.actions({
        select: ({data}) => {
          url(data)
            .then(uri => hyperapp.setUrl(uri))
            .catch(error => console.warn(error));
        }
      }),
    }, (state, actions) => {
      const ArticlesView = listView.component(state.articlesView, actions.articlesView);

      return h(Box, {margin: false}, [
        h(Panes, {
          box: {grow: 1, shrink: 1},
          sizes: [280]
        }, [
          h(Box, {grow: 1, shrink: 1}, [
            h(SelectField, {
              box: {margin: false},
              choices: [{value: '', label: '--- Select Channel ---'}, ...state.channels],
              onchange: (ev, value) => actions.setChannel(value)
            }),
            h(ArticlesView, {
              box: {margin: false, grow: 1, shrink: 1}
            })
          ]),
          h(Iframe, {
            class: 'osjs-gui-box-styled',
            box: {grow: 1, shrink: 1},
            src: state.currentUrl
          })
        ])
      ]);
    }, $content);

    proc.on('set-news', news => hyperapp.setNews(news));
  };

  const init = () => {
    proc.on('load-files', () => {
      readdir({path: 'downloads:/News'}, {filter: iter => iter.mime === 'text/html'})
        .then(list => list.splice(1).map(file => {
          const split = file.filename.split('.');

          return {
            date: split[0],
            channel: split[1],
            title: split.slice(2, -1).join(' '),
            file
          };
        }))
        .then(news => proc.emit('set-news', news))
        .catch(error => console.warn(error));
    });

    let interval = setInterval(() => {
      proc.emit('load-files');
    }, 30 * 60 * 1000); // 30 minutes

    proc.on('destroy', () => clearInterval(interval));

    proc.emit('load-files');
  };

  proc.createWindow({
    id: 'WikipediaWindow',
    icon: proc.resource(metadata.icon),
    title: metadata.title.en_EN,
    dimension: {width: 600, height: 300}
  })
    .on('destroy', () => proc.destroy())
    .on('render', init)
    .render(render);

  return proc;
};

osjs.register(applicationName, register);
