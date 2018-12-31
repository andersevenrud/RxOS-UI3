# OS.js Skylark

Conversion of https://github.com/Othernet-Project/RxOS-UI2 into OS.js v3

![Screenshot](https://raw.githubusercontent.com/andersevenrud/RxOS-UI3/master/docs/screenshot.png)

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

## Documentation

See `docs/` directory.

## TODO

### Conversion

* [x] Authentication Adapter
* [x] VFS Mountpoints
* [x] Distro layout
* [x] Client Custimizations
* [x] Client: Low-res optimizations
* [x] Distro: Target files
* [x] Distro: Packaging script
* [ ] Service: Config (**in progress**)
* [ ] Service: Telemetry (**in progress**)
* [ ] Service: Commands (**in progress**)
* [ ] Service: ONDD (**in progress**)
* [ ] App: LogViewer
* [x] App: Messaging
* [ ] App: Network (**in progress**)
* [x] App: News
* [x] App: Radio
* [x] ~~App: Reader~~ *replaced by individual apps*
* [x] App: Tuner
* [x] App: Weather
* [x] App: WhatsNew
* [x] App: Wikipedia
* [x] Documentation: Developer Documentation

### General Improvements

* [ ] Refactor: JSX in apps
* [ ] Refactor: Data over WS ?
