#!/usr/bin/env bash

dest="dist.packed/"
dest_osjs="${dest}/opt/osjs"
webpack=`realpath node_modules/.bin/webpack`

# Remove old files
rm -rf $dest

# Create required directories
mkdir -p $dest_osjs/dist $dest_osjs/src

# Build client with custom path
NODE_ENV=production npx webpack --output-path $dest_osjs/dist

# Build packages
(cd src/packages/Wikipedia && NODE_ENV=production $webpack)
(cd src/packages/Tuner && NODE_ENV=production $webpack)

# Discover packages with custom paths (including copy)
npx osjs-cli package:discover --copy --dist $dest_osjs/dist --discover $dest_osjs/packages.json

# Copy our deployment file templates
cp -r src/target/* $dest/
mkdir -p $dest/mnt/downloads

# Copy OS.js server
cp -r src/server $dest_osjs/src/

# Copy package server files
list=$(cat $dest_osjs/packages.json | jq -r '.[]')

for d in $list; do
  metadata=$(cat $d/metadata.json | jq -r '.server')

  if [[ $metadata != "null" ]]; then
    check="${d}/${metadata}"
    dirname=${check%/*}
    out="${dest}/${dirname}"

    if [[ -a $check ]]; then
      if [[ ! -d $check ]]; then
        echo "Warning: $check is a file.... dependencies might be missed"
      fi
      echo "Copying $check"
      mkdir -p $out
      cp -r $check $out/
    fi
  fi
done
