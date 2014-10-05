#!/bin/bash
# do pre-release actions
# change version number, check that readme has release info.
# TODO gruntify this.

export REL_VER=$1

if [ "${REL_VER:-}" == "" ]; then
	echo Please supply a release version number i.e. 0.2.1
	exit 1
fi

# Update the version numbers in some files
perl -i.bak -pne 's{(\@version \s+)([\.0-9]+)}{$1$ENV{REL_VER}}xmsg; \
   s{(version \s* = \s*.)([\.0-9]+)(.;)}{$1$ENV{REL_VER}$3}xmsg;' \
   lib/perl.js

perl -i.bak -pne 's{("version": \s+ ")([\.0-9]+)(",)}{$1$ENV{REL_VER}$3}xmsg' package.json

if grep "\* $REL_VER" README.md ; then
	echo ok
else
	echo README.md does not contain a release note
fi

# module expects to be called index.js
cp lib/perl.js index.js

# pack the module and show it to check there are no extra files included
npm pack && tar tvzf perljs-*.tgz
rm perljs-*.tgz