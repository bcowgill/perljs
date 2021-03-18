#!/bin/bash
# You can run this directly, but npm will invoke this script at the right time (twice).
# To run it manually you need to create the $LOCK dir first or nothing will happen.
# post-publish script, checks the published npm version number is correct, installs the module and tests it.
# https://docs.npmjs.com/cli/v7/commands/npm-version

CMD=post-publish.sh
PKG=$NPMPKG
NPM=pnpm
LOCK=npm-prepublishOnlyLOCKED

# terminate on first error
set -e

# turn on trace of currently running command if you need it
#set -x

#echo $CMD handler: $* | tee --append local-git.log
#check-ver-lite.sh | tee --append local-git.log

if [ -d package ]; then
	rm -rf package
fi

if [ -d $LOCK ]; then
	echo $CMD handler semaphore dir $LOCK exists.
	rmdir $LOCK
else
	echo $CMD handler semaphore dir $LOCK is gone skipping actions this time.
	exit
fi

# on any exit, for husky we reenable the postinstall script
function restore_pinst {
	echo Finally, enable postinstall for husky.
	pinst --enable
}

trap restore_pinst EXIT
trap restore_pinst ERR

REL_VER=`packagever.sh`
if [ -z "$REL_VER" ]; then
	echo NOT OK getting version number
	exit 80
fi

echo Step 5: It can take a while for the NPM site to update, we will wait a minute before continuing...
sleep 60
echo checking npm site
check-published.sh $REL_VER

echo Step 6: Checking published NPM package for version $REL_VER. | tee packageinfo.txt
$NPM info $PKG >> packageinfo.txt
less -R packageinfo.txt

echo Step 7: Install package from NPM registry locally.
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
echo Step 8: Test local package installed from NPM registry.
./perl/js-test.js ../package/node_modules/$PKG/ $REL_VER

