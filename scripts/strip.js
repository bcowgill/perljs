#!/usr/bin/env node
// Strip ALL comments from js
var src = 'lib/perl.js'
var out = 'perljs.no-comments.js'
var strip = require('uncommentify')({
  all: true,
});

console.log('stripping comments from ' + src + ' and writing to ' + out);
var fs = require('fs');
fs.createReadStream(src)
  .pipe(strip)
  .pipe(fs.createWriteStream(out));
