(function (exports, undefined) {

    var assert_failed = false;

    function assert(guard, message) {
        if ( !guard ) {
            if ( !assert_failed ) {
                debugger;
            }
            assert_failed = true;
            throw new Error(message || 'assert failed');
        }
        return guard;
    }

    //
    // Nil is either null or undefined
    //

    function Nil(x) {
        assert( Nil.is(x), x + ' is not Nil' );
        return x;
    }

    Nil.is = function (x) {
        return x === null || x === undefined;
    };

    Nil.of = Nil;

    //
    // Bool represent a boolean value
    //

    function Bool(x) {
        assert( Bool.is(x), x + ' is not a Bool' );
        return x;
    }

    Bool.is = function (x) {
        return x === true || x === false;
    };

    Bool.of = Bool;

    //
    // Num represent a numeric value, NaN and +/-Infinity excluded
    //

    function Num(x) {
        assert( Num.is(x), x + ' is not a Num' );
        return x;
    }

    Num.is = function (x) {
        return ( typeof x === 'number' || ( x !== null && x.constructor === Number ) ) &&
            isFinite(x) &&
            !isNaN(x);
    };

    Num.of = Num;

    //
    // Str represent a string value
    //

    function Str(x) {
        assert( Str.is(x), x + ' is not a Str' );
        return x;
    }

    Str.is = function (x) {
        return typeof x === 'string' || ( x !== null && x.constructor === String );
    };

    Str.of = Str;

    //
    // Arr represent an array whose elements can be of different types
    //

    function Arr(x) {
        assert( Arr.is(x), x + ' is not a Arr' );
        return x;
    }

    Arr.is = function (x) {
        return x instanceof Array;
    };

    Arr.of = Arr;

    //
    // Obj represent a javascript object literal
    //

    function Obj(x) {
        assert( Obj.is(x), x + ' is not a Obj' );
        return x;
    }

    Obj.is = function (x) {
        return x !== null && x.constructor == Object && !Arr.is(x);
    };

    Obj.of = Obj;

    //
    // Func represent a javascript function
    //

    function Func(x) {
        assert( Func.is(x), x + ' is not a Func' );
        return x;
    }

    Func.is = function (x) {
        return typeof x === 'function';
    };

    Func.of = Func;

    //
    // Err represent a javascript error
    //

    function Err(x) {
        assert( Err.is(x), x + ' is not a Err' );
        return x;
    }

    Err.is = function (x) {
        return x instanceof Error;
    };

    Err.of = function (x) {
        assert(Obj.is(x));
        return mixin(new Error(), x);
    };

    exports.rts = {
        assert: assert,
        Nil: Nil,
        Bool: Bool,
        Num: Num,
        Str: Str,
        Arr: Arr,
        Obj: Obj,
        Func: Func,
        Err: Err
    };

})(typeof exports !== 'undefined' ? exports : window);