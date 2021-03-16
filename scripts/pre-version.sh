#!/bin/bash
# https://docs.npmjs.com/cli/v7/commands/npm-version
# terminate on first error
set -e

# turn on trace of currently running command if you need it
#set -x

CMD=pre-version.sh
# echo $CMD handler: $*

#check-ver-lite.sh | tee --append local-git.log
repo-check.sh --untracked

PREVER=`packagever.sh`
if [ -z "$PREVER" ]; then
	echo NOT OK getting version number
    exit 1
fi

# pre-release ensure tests all pass
make test
exit 1
