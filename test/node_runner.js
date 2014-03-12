var rts = require('../src/rts.js').rts;
var ok = rts.assert;
var ko = function (x) {
    rts.assert(!x);
};
require("./all").specs(rts, ok, ko);