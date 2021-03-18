#!/bin/bash
# bump the package version and build a release.

MESSAGE="$1"
METHOD=${2:-patch}

if [ -z "$MESSAGE" ]; then
	echo "
usage: $0 "description of release" [version-bump]

This will update the version number, build and release the $NPMPKG project to npm.

version-bump   can be patch, minor, major or any other value allowd by npm-version command. defaults to patch if omitted.
"
	exit 1
fi

VMETHOD="$METHOD" VMESSAGE="$MESSAGE" pnpm version $METHOD --no-git-tag-version -m "release Version $METHOD %s $MESSAGE"

