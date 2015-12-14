#!/bin/bash
# post npm version handler
# https://docs.npmjs.com/cli/version

REL_VER=`packagever.sh`
if [ -z "$REL_VER" ]; then
	echo NOT OK getting version number
    exit 1
fi

echo GIT push
git push origin master --tags

rm *.bak
