#! /bin/sh

# $1 is username, $2 is passwd

echo -e "$2\n$2" | passwd "$1"
