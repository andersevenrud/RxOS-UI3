import osjs from 'osjs';
import {name as applicationName} from './metadata.json';

const register = (core, args, options, metadata) => {
  const proc = core.make('osjs/application', {args, options, metadata});

  proc.createWindow({
    id: 'WeatherWindow',
    icon: proc.resource(metadata.icon),
    title: metadata.title.en_EN,
    dimension: {width: 640, height: 480}
  })
    .on('destroy', () => proc.destroy())
    .render($content => {
      const src = proc.resource('index.html');
      const iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.top = '0';
      iframe.style.left = '0';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = '0 none';
      iframe.src = src;
      $content.appendChild(iframe);
    });

  return proc;
};

osjs.register(applicationName, register);
