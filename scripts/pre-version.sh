#!/bin/bash
# pre npm version handler
# https://docs.npmjs.com/cli/version

PREVER=`packagever.sh`
if [ -z "$PREVER" ]; then
    exit 1
fi

# pre-release ensure tests all pass
grunt preversion

exit 1
