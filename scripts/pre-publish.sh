#!/bin/bash
# Do not run directly, npm will invoke this script at the right time.
# pre-publish script, check the repo and package version vs published version.
# https://docs.npmjs.com/cli/v7/commands/npm-version

CMD=pre-publish.sh
PKG=$NPMPKG
NPM=pnpm

echo === ENVIRONMENT ====
echo PATH=$PATH
set

# terminate on first error
set -e

# turn on trace of currently running command if you need it
#set -x

#echo $CMD handler: $* | tee --append local-git.log
#check-ver-lite.sh | tee --append local-git.log

# Git checks normally done by npm, but we are running with --no-git-checks due to our old version of git.
#echo $CMD handler GIT CHECKS | tee --append local-git.log
repo-check.sh
BRANCH=`git symbolic-ref --short HEAD`
if [ "$BRANCH" != 'master' ]; then
	echo "You're on branch \"$BRANCH\" but your \"publish-branch\" is set to \"master|main\". Do you want to continue? \(y/N\) "
	read continue
	case $continue in
		y)		echo ok publishing from branch $BRANCH;;
		Y)		echo ok publishing from branch $BRANCH;;
		*)		exit 70;;
	esac
fi
if [ "`git rev-list --count --left-only @{u}...HEAD`" != '0' ]; then
	echo NOT OK you are publishing from before the HEAD commit or without having set an upstream.
	exit 71
fi
#echo $CMD handler GIT CHECKS DONE | tee --append local-git.log

REL_VER=`packagever.sh`
if [ -z "$REL_VER" ]; then
	echo NOT OK getting version number
	exit 72
fi

COUNT=2
if [ "`grep $REL_VER lib/perl.js | wc -l`" == "$COUNT" ] ; then
	echo ok "lib/perl.js" version updated
else
	echo NOT OK - "lib/perl.js" does not contain $COUNT release version $REL_VER numbers
	exit 73
fi

if grep "\* $REL_VER" README.md ; then
	echo ok README.md
else
	echo NOT OK - README.md does not contain a version $REL_VER release note
	exit 74
fi

COUNT=6
if [ "`grep $REL_VER *.js | wc -l`" == "$COUNT" ] ; then
	echo ok built .js files versions updated
else
	echo NOT OK - built .js files do not contain $COUNT release version $REL_VER numbers
	exit 75
fi

COUNT=4
if [ "`grep $REL_VER doc/*.html | wc -l`" == "$COUNT" ] ; then
	echo ok built documentation files versions updated
else
	echo NOT OK - built documentation files do not contain $COUNT release version $REL_VER numbers
	exit 76
fi

# Error here is ok if we have never been published.
set +e
PUB_VER=`$NPM view $PKG version`
set -e
if [ -z "$PUB_VER" ]; then
	echo WARNING getting published version number, ok if this is first release.
fi

echo VERS: /$REL_VER/$PUB_VER/

if [ "$REL_VER" == "$PUB_VER" ]; then
	echo NOT OK current version has already been published to the npm registry.
	exit 78
fi

rm -rf package || echo "ok no package/ directory exists"

# after this, the package.json prepublishOnly script will run
# it is called once with the directory name as the first argument, then once with no directory name
# so the pinst --disable will make a change to package.json to prevent postinstall action.
# after that the npm pack command is run to create the .tgz archive and it is published.
# Then the publish script runs and then the postpublish runs twice
# first without the directory name, then with the directory name.
#echo $CMD handler out | tee --append local-git.log
