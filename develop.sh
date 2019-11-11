#!/bin/sh
# Recompile JS and CSS automatically after file change in the directory
# Requires inotify-tools

while inotifywait -qre modify .; do
    ./deploy.sh
    npx webpack --mode "development"
done
