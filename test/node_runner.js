var assert = require("assert");
var rts = require('../src/rts.js').rts;
var ok = assert.ok;
var ko = function (x) {
    assert.ok(!x);
};
require("./specs/all").specs(rts, ok, ko);