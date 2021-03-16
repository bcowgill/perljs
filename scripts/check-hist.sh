#!/bin/bash
if which after.sh > /dev/null; then
	after.sh History < README.md
else
	echo Partial Release History
	tail README.md
fi
