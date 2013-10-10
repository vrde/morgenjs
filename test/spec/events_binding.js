(function (describe, it, expect,
           register, create, load, reload, remove,
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
            var ctx1, ctx2, element, controller, callback;

            element = document.createElement('div');
            element.innerHTML = '<a>hi!</a>';

            callback = function () { };

            controller = register('test3', function (c) {
                c.events = {
                    'click a': callback
                };

                ctx1 = c;
            });

            ctx2 = load('test3', element);

            expect(ctx2.element.querySelector('a').__morgenListeners['click'][0])
                .toBe(callback);

            remove(element);

            expect(ctx2.element.querySelector('a').__morgenListeners['click'].length)
                .toBe(0);

        });

        it('reloads listeners', function () {
            var ctx1, ctx2, element, controller, callback,
                listeners = __morgen.totalListeners;

            element = document.createElement('div');
            element.innerHTML = '<a>hi!</a>';

            callback = function () { };

            controller = register('test4', function (c) {
                c.events = {
                    'click,blur a': callback,
                    'blur a': callback
                };

                ctx1 = c;
            });

            ctx2 = load('test4', element);

            expect(ctx2.element.querySelector('a').__morgenListeners['click'].length)
                .toBe(1);

            expect(ctx2.element.querySelector('a').__morgenListeners['click'][0])
                .toBe(callback);

            expect(ctx2.element.querySelector('a').__morgenListeners['blur'][0])
                .toBe(callback);

            expect(ctx2.element.querySelector('a').__morgenListeners['blur'][1])
                .toBe(callback);

            expect(ctx2.element.querySelector('a').__morgenListeners['blur'].length)
                .toBe(2);

            reload('test4');
            reload('test4');
            reload('test4');

            expect(ctx2.element.querySelector('a').__morgenListeners['click'].length)
                .toBe(1);

            expect(ctx2.element.querySelector('a').__morgenListeners['blur'].length)
                .toBe(2);

            ctx1.remove();

            expect(listeners).toBe(__morgen.totalListeners);
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
    window.morgen.reload,
    window.morgen.remove,
    window.__morgen
);

