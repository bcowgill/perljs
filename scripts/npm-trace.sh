#!/bin/bash
echo npm action $1 | tee --append local-git.log

# Husky requires to disable the postinstall action while publishing...
case $1 in
	prepublishOnly)		pinst --disable;;
	postpublish)		pinst --enable; exit 98;
esac
