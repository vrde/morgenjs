(function (describe, it, expect,
           register, create, load,
           __morgen) {

    'use strict';


    describe('Register utility', function () {

        it('registers a new controller in the global context', function () {
            var controller = register('test', function () {});

            expect(__morgen.controllers['test']).toBe(controller);
        });


        it('loads the controller in the HTML node', function () {
            var controller = register('test1', function () {}),
                instance   = load('test1'),
                htmlElem   = document.querySelector('html');

            expect(instance.element).toBe(htmlElem);
        });


        it('loads the controller in a new node', function () {
            var controller = register('test2', function () {}),
                elem       = create('test2');

            expect(elem).toBe(elem);
        });

    });

}) (
    // JasmineJS stuff
    window.describe,
    window.it,
    window.expect,

    // Domain specific stuff
    window.morgen.register,
    window.morgen.create,
    window.morgen.load,
    window.__morgen
);

