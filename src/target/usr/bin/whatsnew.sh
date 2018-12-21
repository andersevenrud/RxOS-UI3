#!/bin/sh

set -euf

days="$1"
maxlines="$2"

find /mnt/downloads -type f -mtime "-$days" | while read fn
do
    base_fn="${fn#/mnt/downloads/}"
    if [ $(expr "${base_fn}" : "\..*") -eq 0 ]
    then
        echo $(stat -c "%Y" "$fn"),"${base_fn}"
    fi
done | sort -t , -k 1 -r -n -s | head -n "$maxlines"

