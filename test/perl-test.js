// perl-test.js

var should = require('chai').should(),
    perl = require('../lib/perl');

describe('#perl.q()', function() {
  it('single quotes a string', function() {
    perl.q('quote me baby').should.equal('\'quote me baby\'');
  });
});

describe('#perl.qq()', function() {
  it('double quotes a string', function() {
    perl.qq('quote me baby').should.equal('"quote me baby"');
  });
});

describe('#perl.qw()', function() {
  it('makes array out of string', function() {
    perl.qw('   split   me 	baby\n\nyou know you want to   ').join('/').should.equal('split/me/baby/you/know/you/want/to');
  });
});

describe('#perl.x()', function() {
  it('repeats itself N times', function() {
    perl.x('repeat after me', 4).should.equal('repeat after merepeat after merepeat after merepeat after me');
  });
});
