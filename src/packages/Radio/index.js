import osjs from 'osjs';
import {h, app} from 'hyperapp';
import {Box} from '@osjs/gui';
import {name as applicationName} from './metadata.json';

const register = (core, args, options, metadata) => {
  const proc = core.make('osjs/application', {args, options, metadata});
  const url = core.config('skylark.radio');

  proc.createWindow({
    id: 'RadioWindow',
    icon: proc.resource(metadata.icon),
    title: metadata.title.en_EN,
    dimension: {width: 320, height: 160},
    attributes: {
      maximizable: false,
      resizable: false,
      minDimension: {width: 320, height: 160}
    }
  })
    .on('destroy', () => proc.destroy())
    .render($content => {
      app({}, {}, () => {
        return h(Box, {grow: 1, shrink: 1, align: 'center', justify: 'center'}, [
          h('h1', {}, [
            h('a', {
              href: url,
              target: '_blank'
            }, 'Othernet Satellite Radio')
          ]),
          h('audio', {
            controls: 'controls',
            src: url
          }, 'Your browser does not support the audio tag')
        ]);
      }, $content);
    });

  return proc;
};

osjs.register(applicationName, register);
