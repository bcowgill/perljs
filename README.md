perljs
======

Perl for Javascript. Just some functions that a perl developer misses in Javascript.

Publishing a node module
http://quickleft.com/blog/creating-and-publishing-a-node-js-module

npm set init.author.name "Brent Cowgill"
npm set init.author.email "brent@blismedia.com"
npm set init.author.url "http://github.com/bcowgill"
npm adduser

D:\d\s\github\perljs>npm set init.author.name "Brent Cowgill"

D:\d\s\github\perljs>npm set init.author.email "brent@blismedia.com"

D:\d\s\github\perljs>npm set init.author.url "http://github.com/bcowgill"

D:\d\s\github\perljs>npm adduser
Username: bcowgill
Password:
Email: (this IS public) brent@blismedia.com
npm http PUT https://registry.npmjs.org/-/user/org.couchdb.user:bcowgill
npm http 201 https://registry.npmjs.org/-/user/org.couchdb.user:bcowgill

npm init

This utility will walk you through creating a package.json file.
It only covers the most common items, and tries to guess sane defaults.

See `npm help json` for definitive documentation on these fields
and exactly what they do.

Use `npm install <pkg> --save` afterwards to install a package and
save it as a dependency in the package.json file.

Press ^C at any time to quit.
name: (perljs)
version: (0.0.0)
description: Perl for Javascript. Just some functions that a perl developer miss
es in Javascript.
entry point: (index.js) perl.js
test command:
git repository: (https://github.com/bcowgill/perljs.git)
keywords: perl
license: (ISC) The Unlicense
About to write to D:\d\s\github\perljs\package.json:

{
  "name": "perljs",
  "version": "0.0.0",
  "description": "Perl for Javascript. Just some functions that a perl developer
 misses in Javascript.",
  "main": "perl.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/bcowgill/perljs.git"
  },
  "keywords": [
    "perl"
  ],
  "author": "Brent Cowgill <brent@blismedia.com> (http://github.com/bcowgill)",
  "license": "The Unlicense",
  "bugs": {
    "url": "https://github.com/bcowgill/perljs/issues"
  },
  "homepage": "https://github.com/bcowgill/perljs"
}


Is this ok? (yes) yes
