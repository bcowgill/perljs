#!/bin/bash
echo npm action $1

case $1 in
	prepublishOnly)		pinst --disable;;
	postpublish)		pinst --enable;;
esac

exit 98
