#!/usr/bin/env bash

mkdir -p target/mnt/conf/etc
mkdir -p target/mnt/downloads
cp -r src/target/* target

echo "*** WARNING ***"
echo "Some symlinks will be replaced with local ones."
echo "DO NOT COMMIT THESE CHANGES"
echo "*** WARNING ***"

root=`realpath target/mnt/downloads/Weather`

pushd src/packages/Weather/data/data
  rm oscar
  rm weather
  ln -sf $root/data/oscar oscar
  ln -sf $root/data/weather weather
popd
