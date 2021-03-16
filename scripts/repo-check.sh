#!/bin/bash
# our git version 1.9.1 does not support --porcelain=v1 so we have to hack this check that npm would do for us.
if [ "`git --version`" == "git version 1.9.1" ]; then
	CLEAN=`git status --porcelain -uno | wc -l`
	# echo CLEAN=$CLEAN
	if [ $CLEAN != 0 ]; then
		echo $CMD ERR: Git working directory not clean.  $CLEAN uncommitted changes.  1>&2
		exit 20
	fi
else
	echo NOTICE: Your git version may support --porcelain=v1 syntax so you may not need this hack and the --no-git-tag-version in your npm version command.
fi

if [ "$1" == "--untracked" ]; then
	CLEAN=`git status --porcelain -uall`
	if [ `echo "$CLEAN" | wc -l` != "0" ]; then
		echo $CMD QUERY: Untracked files in git working directory.
		echo "$CLEAN"
		echo "Are you sure none of these files need to be in the version release? Press Ctrl-C to abort."
		read continue
	fi
fi
