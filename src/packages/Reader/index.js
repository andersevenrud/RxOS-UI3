import osjs from 'osjs';
import {h, app} from 'hyperapp';
import {Box, Menubar, MenubarItem, Iframe} from '@osjs/gui';
import {name as applicationName} from './metadata.json';

const viewerjs = (mime, u) => `ViewerJS/index.html#${u}`;
const epubjs = (mime, u) => `epub.js/index.html?u=${encodeURIComponent(u)}`;
const showdown = (mime, u) => `showdown/index.html?u=${encodeURIComponent(u)}`;
const playerjs = (mime, u) => mime.match(/^audio/)
  ? `MediaElement/index.html?type=audio&u=${encodeURIComponent(u)}`
  : `MediaElement/index.html?type=video&u=${encodeURIComponent(u)}`;

const mimeMap = {
  'application/pdf': viewerjs,
  'application/vnd.oasis.opendocument.presentation': viewerjs,
  'application/vnd.oasis.opendocument.spreadsheet': viewerjs,
  'application/vnd.oasis.opendocument.text': viewerjs,
  '^video/': playerjs,
  '^audio/': playerjs,
  'application/epub+zip': epubjs,
  'application/epub': epubjs,
  'text/markdown': showdown
};

const resolver = proc => (file, uri) => {
  const resolve = u => proc.resource(u);

  if (mimeMap[file.mime]) {
    return resolve(mimeMap[file.mime](file.mime, uri));
  }

  const matched = Object.keys(mimeMap)
    .find(re => file.mime.match(re));

  return matched
    ? resolve(mimeMap[matched](file.mime, uri))
    : uri;
};

const register = (core, args, options, metadata) => {
  const _ = core.make('osjs/locale').translate;
  const proc = core.make('osjs/application', {args, options, metadata});
  const {url} = core.make('osjs/vfs');

  const win = proc.createWindow({
    id: 'ReaderWindow',
    icon: proc.resource(metadata.icon),
    title: metadata.title.en_EN,
    dimension: {width: 400, height: 200}
  });

  const basic = core.make('osjs/basic-application', proc, win, {});
  const resolve = resolver(proc);

  win.render($content => {
    const ha = app({
      url: ''
    }, {
      setUrl: ({file, uri}) => ({url: resolve(file, uri)}),

      load: file => (state, actions) => {
        url(file)
          .then(uri => actions.setUrl({file, uri}))
          .catch(error => console.warn(error)); // FIXME
      },

      menu: ev => (state, actions) => {
        core.make('osjs/contextmenu').show({
          position: ev.target,
          menu: [
            {label: _('LBL_OPEN'), onclick: () => actions.menuOpen()},
            {label: _('LBL_QUIT'), onclick: () => actions.menuQuit()}
          ]
        });
      },

      menuOpen: () => state => basic.createOpenDialog(),
      menuQuit: () => state => proc.destroy()
    }, (state, actions) => {
      return h(Box, {}, [
        h(Menubar, {}, [
          h(MenubarItem, {onclick: ev => actions.menu(ev)}, _('LBL_FILE'))
        ]),
        h(Iframe, {
          src: state.url,
          box: {grow: 1, shrink: 1}
        })
      ]);
    }, $content);

    basic.on('open-file', ha.load);
    basic.init();
  });

  win.on('destroy', () => proc.destroy());
  proc.on('destroy', () => basic.destroy());

  return proc;
};

osjs.register(applicationName, register);
