#!/bin/bash
# npm version handler after version number has been bumped
# https://docs.npmjs.com/cli/version

VER=`packagever.sh`
if [ -z "$VER" ]; then
    exit 1
fi
