#!/bin/bash
# You can run this directly, but npm will invoke this script at the right time.
# post-publish script, checks the published npm version number is correct, installs the module and tests it.
# https://docs.npmjs.com/cli/v7/commands/npm-version

CMD=post-publish.sh
PKG=$NPMPKG
NPM=pnpm

# terminate on first error
set -e

# turn on trace of currently running command if you need it
#set -x

#echo $CMD handler: $* | tee --append local-git.log
#check-ver-lite.sh | tee --append local-git.log

if [ -d package ]; then
	echo package/ exists, remove and exit.
	rm -rf package
	exit
fi

# on any exit, for husky we reenable the postinstall script
function restore_pinst {
	echo Finally, enable postinstall
	pinst --enable
}

trap restore_pinst EXIT
trap restore_pinst ERR

REL_VER=`packagever.sh`
if [ -z "$REL_VER" ]; then
	echo NOT OK getting version number
	exit 80
fi

echo It can take a while for the npm site to update, we will wait a minute before continuing...
sleep 60
echo checking npm site
check-published.sh $REL_VER

$NPM info $PKG > packageinfo.txt
less -R packageinfo.txt

echo install and test package from npm registry
rm -rf package || echo "ok no package dir"
mkdir package
echo "{
  \"dependencies\": {
    \"$PKG\": \"*\"
  }
}" > package/package.json
pushd package
	$NPM install
popd
./perl/js-test.js ../package/node_modules/$PKG/ $REL_VER

