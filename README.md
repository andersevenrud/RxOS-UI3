# OS.js Skylark

Conversion of https://github.com/Othernet-Project/RxOS-UI2 into OS.js v3

## Requirements

Node 8 or above

## Installation

```
# Install dependencies
npm install
```

## Development

```
# Set up development environment target
./bin/dev.sh

# Discover installed packages
npm run package:discover

# Build
SKYLARK_DEVELOPMENT=true npm run build

# Start server
SKYLARK_DEVELOPMENT=true npm run serve
```

Launches at http://localhost:8080 by default

To watch for changes in the backround run `SKYLARK_DEVELOPMENT=true npm run watch`

## Packaging

To create a packaged distribution, run: `./bin/pack.sh`

The distribution will be output to `dist.packed/`.

## TODO

* [x] Authentication Adapter
* [x] VFS Mountpoints
* [x] Distro layout
* [x] Client style configs
* [x] Distro: Target files
* [x] Distro: Packaging script
* [ ] Service: Config (**in progress**)
* [ ] Service: Telemetry (**in progress**)
* [ ] Service: Commands (**in progress**)
* [ ] Service: ONDD (**in progress**)
* [ ] App: LogViewer
* [x] App: Messaging
* [ ] App: Network
* [x] App: News
* [x] App: Radio
* [x] ~~App: Reader~~ *replaced by individual apps*
* [ ] App: Tuner (**in progress**)
* [x] App: Weather
* [x] App: WhatsNew
* [x] App: Wikipedia
* [ ] Corrections: Package metadata
* [ ] Refactor: JSX
* [ ] Refactor: Data over WS
* [ ] Documentation: Developer Documentation

## Notes

* All packages share the bottom `node_modules/` and `webpack.config.js`
* I discovered that some v2 GUI features has not made it into v3
* At the moment the server uses dummy (testing) authentication. See `src/server/config.js`
* When running in development mode, everything is stored in `vfs/` and `target/`

## Included Stuff

* `@osjs/calculator-application`
* `@osjs/epub-application`
* `@osjs/filemanager-application`
* `@osjs/musicplayer-application`
* `@osjs/pdfreader-application`
* `@osjs/preview-application`
* `@osjs/textpad-application`
* `@osjs/proc-provider`
