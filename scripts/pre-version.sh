#!/bin/bash
# pre npm version handler
# https://docs.npmjs.com/cli/version

# TODO update npm commands to pnpm or npm for publishing?

# terminate on first error
set -e
# turn on trace of currently running command if you need it
#set -x

PREVER=`packagever.sh`
if [ -z "$PREVER" ]; then
	echo NOT OK getting version number
    exit 1
fi

# pre-release ensure tests all pass
grunt preversion
