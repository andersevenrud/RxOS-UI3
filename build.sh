#!/usr/bin/env bash
webpack=`realpath node_modules/.bin/webpack`

(cd src/packages/Wikipedia && $webpack)
