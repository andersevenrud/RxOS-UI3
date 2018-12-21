# OS.js Skylark

Conversion of https://github.com/Othernet-Project/RxOS-UI2 into OS.js v3

## Requirements

Node 8 or above

## Installation

```
# Install dependencies
npm install

# Discover packages
npm run package:discover

# Build client
npm run build

# Build packages
./build.sh
```

## Running

`npm run serve`

Launches at http://localhost:8080 by default

## Packaging

To create a packaged distribution, run: `./pack.sh`

**Work in progress**

## TODO

* [x] Authentication Adapter
* [x] VFS Mountpoints
* [x] Distro layout
* [x] Client style configs
* [ ] Distro: Target files
* [ ] Distro: Packaging script (**in progress**)
* [ ] App: LogViewer
* [ ] App: Messaging
* [ ] App: Network
* [ ] App: News
* [ ] App: Radio
* [ ] App: Reader
* [ ] App: Tuner
* [ ] App: Weather
* [ ] App: WhatsNew
* [x] App: Wikipedia

## Notes

* All packages share the bottom `node_modules/`
* I discovered that some v2 GUI features has not made it into v3
* At the moment the server uses dummy (testing) authentication. See `src/server/config.js`
