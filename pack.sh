#!/usr/bin/env bash

export NODE_ENV=production

rm -rf dist

npx osjs-cli package:discover --copy

npx osjs-cli build

./build.sh
