(function (describe, it, expect, create, load) {

    'use strict';


    describe('Register utility', function () {

        it('load a new controller in the global context', function () {
            var ctx = load('');

        });

    });

}) (
    // JasmineJS stuff
    window.describe,
    window.it,
    window.expect,

    // Domain specific stuff
    window.morgen.create,
    window.morgen.load
);

