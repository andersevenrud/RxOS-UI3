#!/bin/sh

# find all aprs files in "$1", take the latest (sorted by timestamped name) "$2"
# cat them, exclude empty lines, and take the top "$3" lines, and output them

find "$1" -type f -prune | sort -r | head -n "$2" | xargs -I {} cat "{}" | grep -v -e '^$' | head -n  "$3"
