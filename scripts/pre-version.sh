#!/bin/bash
# Do not run directly, npm will invoke this script at the right time.
# pre-version script, check the repo and run the tests before the package version number is updated by npm.
# https://docs.npmjs.com/cli/v7/commands/npm-version

CMD=pre-version.sh

# terminate on first error
set -e

# turn on trace of currently running command if you need it
#set -x

#echo $CMD handler: $* | tee --append local-git.log
#check-ver-lite.sh | tee --append local-git.log

if [ -z "$VMETHOD" ]; then
	echo NOT OK VMETHOD is not defined, please use bump.sh to begin a version release.
	exit 50
fi

if [ -z "$VMESSAGE" ]; then
	echo NOT OK VMESSAGE is not defined, please use bump.sh to begin a version release.
	exit 51
fi

repo-check.sh --untracked

PREVER=`packagever.sh`
if [ -z "$PREVER" ]; then
	echo NOT OK getting version number
	exit 52
fi

# pre-version ensure tests all pass
make test
