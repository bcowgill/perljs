#!/bin/bash
CMD=pre-version.sh
# echo pre npm version handler: $*

check-ver-lite.sh | tee --append local-git.log
repo-check.sh
exit
# https://docs.npmjs.com/cli/version

# TODO update npm commands to pnpm or npm for publishing?

NPM=npm
PNPM=pnpm

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
# TODO before a version release should run full build and give opportunity to commit the changes.
