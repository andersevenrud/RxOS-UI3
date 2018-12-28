# Developer Documentation

Use the `SKYLARK_DEVELOPMENT=true` environmental variable when running on a local development environment.

This will ensure that only local paths are used and certain features will be hard-wired to work outside the Skylark device.

## I'm new to OS.js v3

See https://manual.os-js.org/v3/ for more information.

## Archtitecture

All of the functionality is provided by Servide Providers.

All of the used endpoints and core events are set up in `src/client/provider.js` -- which all applications etc. use.

This makes it easy to swap out the actual server.

## Adding Applications

> NOTE: Applications share the root-level dependencies from `pacakge.json`, as well as the `webpack.config.js` file.

1. Create a new package in `src/packages`
2. Modify the `webpack.config.js` file to use a callback (see other apps)
3. Update `webpack.config.js` in root directory
4. Run `npm run package:discover`
5. Rebuild with `npm run build` or restart `npm run watch`

## Creating build for deployment

> NOTE: This currently does not shake the dependency tree. Ideally a new `package.json` file should be created with the `@osjs/server` dependency and all other used within added providers.

To create a packaged distribution, run: `./bin/pack.sh`

The distribution will be output to `dist.packed/`.

## Notes

* I discovered that some v2 GUI features has not made it into v3 -- I will backport these
* At the moment the server uses dummy (testing) authentication. See `src/server/config.js`
* When running in development mode, everything is stored in `vfs/` and `target/`

## Included Stuff

This is a list of included official service providers and packages.

* `@osjs/calculator-application`
* `@osjs/epub-application`
* `@osjs/filemanager-application`
* `@osjs/musicplayer-application`
* `@osjs/pdfreader-application`
* `@osjs/preview-application`
* `@osjs/textpad-application`
* `@osjs/webodf-application`
* `@osjs/proc-provider`
