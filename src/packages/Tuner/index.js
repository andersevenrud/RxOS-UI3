import osjs from 'osjs';
import {h, app} from 'hyperapp';
import {name as applicationName} from './metadata.json';

import {
  Box
} from '@osjs/gui';

const register = (core, args, options, metadata) => {
  const proc = core.make('osjs/application', {args, options, metadata});

  const render = $content => {
    const hyperapp = app({
    }, {
    }, (state, actions) => {
      return h(Box, {}, [
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
