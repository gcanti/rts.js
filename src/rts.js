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
        return ( typeof x === 'number' || ( !Nil.is(x) && x.constructor === Number ) ) &&
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
        return typeof x === 'string' || ( !Nil.is(x) && x.constructor === String );
    };

    Str.of = Str;

    //
    // Arr represent an array whose elements may be of different types
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
        return !Nil.is(x) && x.constructor === Object && !Arr.is(x);
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

    Err.of = Err;

    //
    // Subtype. A subtype of type T by p is the set of elements of T that satisfy 
    // the characteristic function p
    //

    function Subtype(T, p) {

        assert( Func.is( T ) );
        assert( Func.is( p ) );

        function Subtype(x) {
            assert( Subtype.is( x ), x + ' is not a subtype of ' + T.name + ' by ' + p );
            return x;
        }

        Subtype.is = function (x) {
            return T.is( x ) && p( x );
        };

        Subtype.of = function (x) {
            return Subtype( T.of( x ) );
        };

        return Subtype;
    }

    //
    // Enum. An enum is an extensional definition of a Str subtype
    //

    function to_obj(a) {
        var o = {};
        for ( var i = 0, len = a.length ; i < len ; i++ ) {
            assert( Str.is(a[i]) );
            o[a[i]] = i;
        }
        return o;
    }

    function Enum(elements) {

        assert( List(Str).is(elements) );

        function Enum(x) {
            assert( Enum.is(x), x + ' is not in ' + elements );
            return x;
        }

        // store orginal array
        Enum.elements = elements;

        // store a hash for fast lookup
        Enum.index = to_obj( elements );

        Enum.is = function (x) {
            return Str.is( x ) && Enum.index.hasOwnProperty( x );
        };

        Enum.of = Enum;

        return Enum;

    }

    //
    // List. A list of T is an array whose elements are all of type T
    //

    function List(T) {

        assert( Func.is(T) );

        function List(x) {
            assert( List.is( x ), x + ' is not a list of ' + T.name );
            return x;
        }

        List.is = function (x) {
            if ( !Arr.is( x ) ) {
                return false;
            }
            for (var i = 0, len = x.length ; i < len ; i++)  {
                if ( !T.is( x[i] ) ) {
                    return false;
                }
            }
            return true;
        };

        List.of = function (x) {
            assert( Arr.is(x) );
            var xs = [];
            for (var i = 0, len = x.length ; i < len ; i++)  {
                xs.push( T.of( x[i] ) );
            }
            return xs;
        };

        return List;
    }

    //
    // Sum type
    //

    function Union(TS) {

        assert( List(Func).is( TS ) );

        function Union(x) {
            assert( Union.is( x ), x + ' is not either ' + TS );
            return x;
        }

        Union.is = function (x) {
            for (var i = 0, len = TS.length ; i < len ; i++) {
                if ( TS[i].is( x ) ) {
                    return true;
                }
            }
            return false;
        };

        Union.of = function () {
            assert( false, 'you must provide a custom of()' );
        };

        return Union;

    }

    //
    // Haskell-like Maybe, a special case of Union
    //

    function Maybe(T) {

        var Maybe = Union([Nil, T]);

        Maybe.of = function (x) {
            return Nil.is(x) ? null : T.of(x);
        };

        return Maybe;

    }

    //
    // Tuples
    //

    function Tuple(TS) {

        assert( List(Func).is( TS ) );

        var len = TS.length;

        function Tuple(x) {
            assert( Tuple.is( x ) );
            return x;
        }

        Tuple.is = function (x) {
            if ( !Arr.is( x ) ) {
                return false;
            }
            if ( x.length !== len ) {
                return false;
            }
            for (var i = 0 ; i < len ; i++)  {
                if ( !TS[i].is( x[i] ) ) {
                    return false;
                }
            }
            return true;
        };

        Tuple.of = function (x) {
            assert( Arr.is(x) );
            assert( x.length === len );
            var xs = [];
            for (var i = 0 ; i < len ; i++)  {
                xs.push( TS[i].of( x[i] ) );
            }
            return xs;
        };

        return Tuple;

    }

    //
    // dictionary K -> V, when K is a subtype of Str
    //

    function Dict(K, V) {

        var Dict = function (x) {
            assert( Dict.is(x), x + ' is not a Dict (' + K + ', ' + V + ')' );
            return x;
        };

        Dict.is = function (x) {
            if ( !Obj.is( x ) ) {
                return false;
            }
            for (var k in x) {
                if ( x.hasOwnProperty( k ) ) {
                    if ( !K.is( k ) ) {
                        return false;
                    }
                    if ( !V.is( x[k] ) ) {
                        return false;
                    }
                }
            }
            return true;
        };

        Dict.of = function (x) {

            assert( Obj.is( x ) );

            var ret = {};
            for (var k in x) {
                if ( x.hasOwnProperty( k ) ) {
                    ret[ K.of( k ) ] = V.of( x[k] );
                }
            }
            return ret;

        };

        return Dict;

    }

    //
    // duck typing
    //

    function Interface(descriptor) {

        assert( Obj.is( descriptor ) );

        function Interface(x) {
            assert( Interface.is( x ) );
            return x;
        }

        Interface.is = function (x) {
            if ( !Obj.is( x ) ) {
                return false;
            }
            for (var k in descriptor) {
                if ( !descriptor[k].is( x[k] ) ) {
                    return false;
                }
            }
            return true;
        };

        Interface.of = Interface;

        return Interface;
    }

    exports.rts = {
        assert: assert,
        Nil: Nil,
        Bool: Bool,
        Num: Num,
        Str: Str,
        Arr: Arr,
        Obj: Obj,
        Func: Func,
        Err: Err,
        Subtype: Subtype,
        Enum: Enum,
        List: List,
        Union: Union,
        Maybe: Maybe,
        Tuple: Tuple,
        Dict: Dict,
        Interface: Interface
    };

})(typeof exports !== 'undefined' ? exports : window);