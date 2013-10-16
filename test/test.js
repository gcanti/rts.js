var assert = require("assert");
var rts = require('../src/rts.js').rts;
var Nil = rts.Nil;
var Obj = rts.Obj;

describe('Nil', function(){
    describe('#is(x)', function(){
        it('should return true when x is null or undefined', function(){
            assert.equal(true, Nil.is(null));
            assert.equal(true, Nil.is(undefined));
        });
        it('should return false when x is neither null nor undefined', function(){
            assert.equal(false, Nil.is(1));
            assert.equal(false, Nil.is(true));
            assert.equal(false, Nil.is('a'));
            assert.equal(false, Nil.is([]));
            assert.equal(false, Nil.is({}));
            assert.equal(false, Nil.is(function () {}));
        });
    });
});

describe('Obj', function(){
    describe('#is(x)', function(){
        it('should return true when x is an object literal', function(){
            assert.equal(true, Obj.is({}));
        });
        it('should return false when x is not an object literal', function(){
            assert.equal(false, Obj.is(null));
            assert.equal(false, Obj.is([]));
            assert.equal(false, Obj.is(new String('1')));
            assert.equal(false, Obj.is(new Number(1)));
            assert.equal(false, Obj.is(new Boolean()));
        });
    });
});