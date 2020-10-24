#!/usr/bin/env node
// Strip ALL comments from js
var strip = require('uncommentify')({
  all: true,
});

console.log(strip);
var fs = require('fs');
fs.createReadStream('lib/perl.js')
  .pipe(strip)
  .pipe(fs.createWriteStream('perljs.no-comments.js'));
