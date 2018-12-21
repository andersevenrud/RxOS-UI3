#! /bin/sh

# generated messages formatted correctly for the api call
# time stamp (epoch time),srcname,message

num_days="$1"
num_lines="$2"
shift
shift


find "$@" -mtime "-$num_days" -type f | while read l
do
    fname=$(basename "$l")
    dname=$(dirname "$l")
    srcname=$(basename "$dname")
    d=$(echo "$fname" | cut -d - -f 2- | cut -d . -f 1 | tr _ ' ' )
    ts=$(date -d "$d" +%s)
    while read a
    do
        echo "$a" | tr -d '\n' | sed -e "s/^/$ts,$srcname,/"
        echo
    done < "$l"
done | sort -nr -t , -k 1 | head -n "$num_lines"
