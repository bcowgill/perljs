#!/bin/bash
# https://docs.npmjs.com/cli/v7/commands/npm-version
# terminate on first error
set -e
CMD=pre-version.sh
# echo $CMD handler: $*

#check-ver-lite.sh | tee --append local-git.log
repo-check.sh
exit

# TODO update npm commands to pnpm or npm for publishing?

NPM=npm
PNPM=pnpm

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
