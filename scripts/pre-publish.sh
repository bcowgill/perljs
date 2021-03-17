#!/bin/bash
CMD=pre-publish.sh
# Pre-publish script, check the repo and package version vs published version.
# https://docs.npmjs.com/cli/v7/commands/npm-version

# terminate on first error
set -e

# turn on trace of currently running command if you need it
#set -x

echo $CMD handler: $* | tee --append local-git.log
check-ver-lite.sh | tee --append local-git.log

# Git checks normally done, but we are running with --no-git-checks due to our old version of git. TODO
repo-check.sh
BRANCH=`git symbolic-ref --short HEAD`
if [ "$BRANCH" != 'master' ]; then
	echo "You're on branch \"$BRANCH\" but your \"publish-branch\" is set to \"master|main\". Do you want to continue? \(y/N\) "
	read continue
	case $continue in
		y)		echo ok publishing from branch $BRANCH;;
		Y)		echo ok publishing from branch $BRANCH;;
		*)		exit 79;; # TODO
	esac
fi
if [ "`git rev-list --count --left-only @{u}...HEAD`" != '0' ]; then
	echo NOT OK you are publishing from before the HEAD commit.
	exit 78 # TODO
fi

REL_VER=`packagever.sh`
if [ -z "$REL_VER" ]; then
	echo NOT OK getting version number
	exit 70
fi

PKG=$NPMPKG
NPM=pnpm
PUB_VER=`$NPM view $PKG version`
if [ -z "$PUB_VER" ]; then
	echo NOT OK getting published version number
	exit 71
fi
echo VERS: /$REL_VER/$PUB_VER/

exit 99
