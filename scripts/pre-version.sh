#!/bin/bash
CMD=pre-version.sh
# Pre-version script, check the repo and run the tests before the package version number is updated by npm.
# https://docs.npmjs.com/cli/v7/commands/npm-version

# terminate on first error
set -e

# turn on trace of currently running command if you need it
#set -x

#echo $CMD handler: $* | tee --append local-git.log
#check-ver-lite.sh | tee --append local-git.log

set | grep xyzzy

repo-check.sh --untracked

PREVER=`packagever.sh`
if [ -z "$PREVER" ]; then
	echo NOT OK getting version number
    exit 1
fi

# pre-version ensure tests all pass
make test
exit 1
