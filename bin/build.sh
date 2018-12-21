#!/usr/bin/env bash
webpack=`realpath node_modules/.bin/webpack`

npm run package:discover

(cd src/packages/Wikipedia && $webpack)
(cd src/packages/Tuner && $webpack)
