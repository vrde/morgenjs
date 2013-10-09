(function (describe, it, expect,
           register, create, load, remove,
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

        it('loads listeners', function () {
            var ctx1, ctx2, element, controller;

            element = document.createElement('div');
            element.innerHTML = '<a>hi!</a>';

            controller = register('test3', function (c) {
                c.events = {
                    'click a': function () { }
                };

                ctx1 = c;
            });

            ctx2 = load('test3', element);

            expect(ctx2.element.querySelector('a').__morgenListeners['click'][0])
                .toBe(ctx1.events['click a']);

            remove(element);

            expect(ctx2.element.querySelector('a').__morgenListeners['click'].length)
                .toBe(0);

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
    window.morgen.remove,
    window.__morgen
);

