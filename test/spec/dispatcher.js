(function (describe, it, expect, createSpy,
           hub, dispatch,
           __morgen) {

    'use strict';


    describe('Dispatcher', function () {

        it('dispatch events to the subscribers', function () {
            var listener = createSpy('listener');
            hub.addEventListener('test-event', listener);
            dispatch('test-event', { foo: 'bar' });

            expect(listener).toHaveBeenCalled();
        });


    });

}) (
    // JasmineJS stuff
    window.describe,
    window.it,
    window.expect,
    window.jasmine.createSpy,

    // Domain specific stuff
    window.morgen.hub,
    window.morgen.dispatch,
    window.__morgen
);

