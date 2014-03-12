(function (exports) {

    exports.specs = function (rts, ok, ko) {

        var Nil = rts.Nil;
        var Bool = rts.Bool;
        var Num = rts.Num;
        var Str = rts.Str;
        var Arr = rts.Arr;
        var Obj = rts.Obj;
        var Func = rts.Func;
        var Err = rts.Err;
        var Subtype = rts.Subtype;
        var Enum = rts.Enum;
        var List = rts.List;
        var Union = rts.Union;
        var Maybe = rts.Maybe;
        var Tuple = rts.Tuple;
        var Dict = rts.Dict;
        var Interface = rts.Interface;

        //
        // basic types specs
        //

        describe('Nil', function(){
            describe('#is(x)', function(){
                it('should return true when x is null or undefined', function(){
                    ok(Nil.is(null));
                    ok(Nil.is(undefined));
                });
                it('should return false when x is neither null nor undefined', function(){
                    ko(Nil.is(0));
                    ko(Nil.is(true));
                    ko(Nil.is(''));
                    ko(Nil.is([]));
                    ko(Nil.is({}));
                    ko(Nil.is(function () {}));
                    ko(Nil.is(/a/));
                    ko(Nil.is(new RegExp('a')));
                });
            });
        });

        describe('Bool', function(){
            describe('#is(x)', function(){
                it('should return true when x is true or false', function(){
                    ok(Bool.is(true));
                    ok(Bool.is(false));
                });
                it('should return false when x is neither true nor false', function(){
                    ko(Bool.is(null));
                    ko(Bool.is(undefined));
                    ko(Bool.is(0));
                    ko(Bool.is(''));
                    ko(Bool.is([]));
                    ko(Bool.is({}));
                    ko(Bool.is(function () {}));
                    ko(Bool.is(/a/));
                    ko(Bool.is(new RegExp('a')));
                });
            });
        });

        describe('Num', function(){
            describe('#is(x)', function(){
                it('should return true when x is a number', function(){
                    ok(Num.is(0));
                    ok(Num.is(1));
                    ok(Num.is(new Number(1)));
                });
                it('should return false when x is not a number', function(){
                    ko(Num.is(NaN));
                    ko(Num.is(Infinity));
                    ko(Num.is(-Infinity));
                    ko(Num.is(null));
                    ko(Num.is(undefined));
                    ko(Num.is(true));
                    ko(Num.is(''));
                    ko(Num.is([]));
                    ko(Num.is({}));
                    ko(Num.is(function () {}));
                    ko(Num.is(/a/));
                    ko(Num.is(new RegExp('a')));
                });
            });
        });

        describe('Str', function(){
            describe('#is(x)', function(){
                it('should return true when x is a string', function(){
                    ok(Str.is(''));
                    ok(Str.is('a'));
                    ok(Str.is(new String('a')));
                });
                it('should return false when x is not a string', function(){
                    ko(Str.is(NaN));
                    ko(Str.is(Infinity));
                    ko(Str.is(-Infinity));
                    ko(Str.is(null));
                    ko(Str.is(undefined));
                    ko(Str.is(true));
                    ko(Str.is(1));
                    ko(Str.is([]));
                    ko(Str.is({}));
                    ko(Str.is(function () {}));
                    ko(Str.is(/a/));
                    ko(Str.is(new RegExp('a')));
                });
            });
        });

        describe('Arr', function(){
            describe('#is(x)', function(){
                it('should return true when x is an array', function(){
                    ok(Arr.is([]));
                });
                it('should return false when x is not an array', function(){
                    ko(Arr.is(NaN));
                    ko(Arr.is(Infinity));
                    ko(Arr.is(-Infinity));
                    ko(Arr.is(null));
                    ko(Arr.is(undefined));
                    ko(Arr.is(true));
                    ko(Arr.is(1));
                    ko(Arr.is('a'));
                    ko(Arr.is({}));
                    ko(Arr.is(function () {}));
                    ko(Arr.is(/a/));
                    ko(Arr.is(new RegExp('a')));
                });
            });
        });

        describe('Obj', function(){
            describe('#is(x)', function(){
                it('should return true when x is an object literal', function(){
                    ok(Obj.is({}));
                });
                it('should return false when x is not an object literal', function(){
                    ko(Obj.is(null));
                    ko(Obj.is(undefined));
                    ko(Obj.is(0));
                    ko(Obj.is(''));
                    ko(Obj.is([]));
                    ko(Obj.is(function () {}));
                    ko(Obj.is(new String('1')));
                    ko(Obj.is(new Number(1)));
                    ko(Obj.is(new Boolean()));
                    ko(Obj.is(/a/));
                    ko(Obj.is(new RegExp('a')));
                });
            });
        });

        describe('Func', function(){
            describe('#is(x)', function(){
                it('should return true when x is a function', function(){
                    ok(Func.is(function () {}));
                    ok(Func.is(new Function()));
                });
                it('should return false when x is not a function', function(){
                    ko(Func.is(null));
                    ko(Func.is(undefined));
                    ko(Func.is(0));
                    ko(Func.is(''));
                    ko(Func.is([]));
                    ko(Func.is(new String('1')));
                    ko(Func.is(new Number(1)));
                    ko(Func.is(new Boolean()));
                    ko(Func.is(/a/));
                    ko(Func.is(new RegExp('a')));
                });
            });
        });

        describe('Err', function(){
            describe('#is(x)', function(){
                it('should return true when x is a function', function(){
                    ok(Err.is(new Error()));
                });
                it('should return false when x is not a function', function(){
                    ko(Err.is(null));
                    ko(Err.is(undefined));
                    ko(Err.is(0));
                    ko(Err.is(''));
                    ko(Err.is([]));
                    ko(Err.is(function () {}));
                    ko(Err.is(new String('1')));
                    ko(Err.is(new Number(1)));
                    ko(Err.is(new Boolean()));
                    ko(Err.is(/a/));
                    ko(Err.is(new RegExp('a')));
                });
            });
        });

        describe('Subtype', function(){
            describe('#is(x)', function(){
                var Positive = Subtype(Num, function (n) {
                    return n > 0;
                });
                it('should return true when x belongs to the subtype', function(){
                    ok(Positive.is(1));
                });
                it("should return false when x don't belongs to the subtype", function(){
                    ko(Positive.is(0));
                });
            });
        });

        describe('Enum', function(){
            describe('#is(x)', function(){
                var e = Enum('a', 'b', 'c');
                it('should return true when x belongs to the enum', function(){
                    ok(e.is('a'));
                });
                it("should return false when x don't belongs to the enum", function(){
                    ko(e.is('d'));
                });
            });
        });

        describe('List', function(){
            describe('#is(x)', function(){
                it('should return true when x is an array of elements of type T', function(){
                    ok(List(Str).is(['a', 'b', 'c']));
                });
                it('should return true when x is not an array of elements of type T', function(){
                    ko(List(Str).is(['a', 1, 'c']));
                });
            });
        });

        describe('Union', function(){
            describe('#is(x)', function(){
                it('should return true when x is any of the types TS', function(){
                    ok(Union(Str, Num).is('a'));
                    ok(Union(Str, Num).is(1));
                });
                it('should return true when x is none of the types TS', function(){
                    ko(Union(Str, Num).is(true));
                });
            });
        });

        describe('Maybe', function(){
            describe('#is(x)', function(){
                it('should return true when x is either null, undefined or of type T', function(){
                    ok(Maybe(Str).is(null));
                    ok(Maybe(Str).is(undefined));
                    ok(Maybe(Str).is('a'));
                    ok(Maybe(List(Str)).is(undefined));
                    ok(Maybe(List(Str)).is(['a']));
                });
                it('should return true when x is none of null, undefined nor of type T', function(){
                    ko(Maybe(Str).is(1));
                });
            });
        });

        describe('Tuple', function(){
            describe('#is(x)', function(){
                it('should return true when x is a tuple', function(){
                    ok(Tuple(Str, Num).is(['a', 1]));
                });
                it('should return true when x is not a tuple', function(){
                    ko(Tuple(Str, Num).is(['a', 'b']));
                });
            });
        });

        describe('Dict', function(){
            describe('#is(x)', function(){
                it('should return true when x is a dict', function(){
                    ok(Dict(Str, Num).is({'a': 1}));
                });
                it('should return true when x is not a dict', function(){
                    ko(Dict(Str, Num).is({'a': true}));
                });
            });
        });

        describe('Interface', function(){
            describe('#is(x)', function(){
                it('should return true when x has a proper structure', function(){
                    ok(Interface({a: Str, b: Num}).is({a: 'str', b: 1}));
                    ok(Interface({a: Str, b: Maybe(Num)}).is({a: 'str'}));
                });
                it('should return true when x has a not proper structure', function(){
                    ko(Interface({a: Str, b: Num}).is({a: 'str', b: true}));
                });
            });
        });

    };

})(typeof exports !== 'undefined' ? exports : window);