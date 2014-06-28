# rts.js

A small JavaScript library for checking types and throwing exceptions.

## Why?

rts is a library which allows you to check the types of JavaScript values at runtime with a simple syntax. 
It is great for checking external input, for testing and for adding safety to your internal code.
Bonus points: Chrome DevTools debugging, serialization/deserialization of your domain objects to/from JSON.

## What?

What kind of types can I check?

Basic types

- Any
- Nil
- Bool
- Num
- Str
- Arr
- Obj
- Func
- Err

Type combinators

- Subtype
- Enum
- List
- Union
- Maybe
- Tuple
- Dict
- Interface

## How?

This library provides a built-in `assert` function you can use. When an assertion
fails in the browser this function starts the debugger so you can inspect the stack
and find what's wrong. Since after a type error many others are expected, 
the debugger starts only once.

## Quick Examples

    // basic types
    Nil.is(null);       // true
    Nil.is(undefined);  // true

    Num.is(1);      // true
    Num.is('str');  // false

    // subtype
    var Positive = Subtype(Num, function (n) {
        return n > 0;
    });
    Positive.is(1); // true
    Positive.is(0); // false

    // enum
    Enum('a', 'b', 'c').is('a');  // true
    Enum('a', 'b', 'c').is(1);    // false

    // list
    List(Str).is(['a', 'b', 'c']);  // true
    List(Str).is(['a', 1, 'c']);    // false

    // Union
    Union(Str, Num).is('a');  // true
    Union(Str, Num).is(1);    // true
    Union(Str, Num).is(true); // false

    // Maybe
    Maybe(Str).is(null);    // true
    Maybe(Str).is('a');     // true
    Maybe(Str).is(1);       // false

    // tuple
    Tuple(Str, Num).is(['a', 1]);     // true
    Tuple(Str, Num).is(['a', 'b']);   // false

    // dictionary
    Dict(Str, Num).is({'a': 1});    // true
    Dict(Str, Num).is({'a': true}); // false

    // duck typing
    Interface({a: Str, b: Num}).is({a: 'str', b: 1});       // true
    Interface({a: Str, b: Num}).is({a: 'str', b: true});    // false

    // a custom type: cartesian product set Num x Num
    function Point(x, y) {
        assert(Num.is(x));
        assert(Num.is(y));
        this.x = x;
        this.y = y;
    }

    Point.is = function (obj) {
        return obj instanceof Point;
    };

    Point.of = function (json) {
        assert(Obj.is(json));
        return new Point(
            Num.of(json.x), 
            Num.of(json.y)
        );
    }

    var p1 = new Point(1, 2);           // build a point
    var p2 = new Point(1, 'a');         // starts the debugger, because of the second argument
    var p3 = Point.of({x: 1, y: 2});    // build a point from JSON

More examples in `/examples`.

## Setup

Node.js

    var rts = require('rts').rts;

Browsers

    <!DOCTYPE html>
    <html>
        <head>
            <script type="text/javascript" src="rts.js"></script>
        </head>
        <body>
            <script type="text/javascript">
                console.log(window.rts);
            </script>
        </body>
    </html>

## Tests

Node.js

    mocha test/node_runner.js

Browsers

Open `test/browser_runner.html`.

# Copyright & License

Copyright (C) 2013 Giulio Canti - Released under the MIT License.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.