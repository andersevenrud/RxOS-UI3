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
* [ ] App: Messaging
* [ ] App: Network
* [ ] App: News
* [ ] App: Radio
* [ ] App: Reader
* [ ] App: Tuner (**in progress**)
* [x] App: Weather
* [x] App: WhatsNew
* [x] App: Wikipedia

## Notes

* All packages share the bottom `node_modules/` and `webpack.config.js`
* I discovered that some v2 GUI features has not made it into v3
* At the moment the server uses dummy (testing) authentication. See `src/server/config.js`
* When running in development mode, everything is stored in `vfs/` and `target/`
