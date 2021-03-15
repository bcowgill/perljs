#!/bin/bash

echo VERSION NUMBERS:
egrep 'version.+[0-9]' package.json lib/perl.js README.md
egrep --with-filename 'version.+[0-9]' npm-shrinkwrap.json | head -2
