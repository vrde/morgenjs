(function (describe, it, expect, createSpy, createRouter) {

    'use strict';


    describe('Route parser', function () {


        it('creates a valid route object from an empty list of routes', function () {
            var router;
            router = createRouter([]);
            expect(router).toBeTruthy();
        });


        it('creates a route object able to manage static paths', function () {
            var mock0, mock1, mock2, mock3, router;

            mock0 = createSpy('mock0');
            mock1 = createSpy('mock1');
            mock2 = createSpy('mock2');
            mock3 = createSpy('mock3');


            router = createRouter([
                ['/'               , mock0],
                ['/resources'      , mock1],
                ['/resources/about', mock2],
                ['/resources/terms', mock3]
            ]);

            router('/');
            expect(mock0).toHaveBeenCalled();

            router('/resources');
            expect(mock1).toHaveBeenCalled();

            router('/resources/about');
            expect(mock2).toHaveBeenCalled();

            router('/resources/terms_');
            expect(mock3).not.toHaveBeenCalled();
        });


        it('creates a route object able to manage arguments', function () {
            var mock0, mock1, mock2, router;

            mock0 = createSpy('mock0');
            mock1 = createSpy('mock1');
            mock2 = createSpy('mock2');


            router = createRouter([
                ['/post/:id'           , mock0],
                ['/post/:id/page-:page', mock1],
                ['/post/:id-test'      , mock2]
            ]);

            router('/post/42');
            expect(mock0).toHaveBeenCalledWith('42');

            router('/post/42/page-3');
            expect(mock1).toHaveBeenCalledWith('42', '3');

            router('/post/11-test');
            expect(mock2).toHaveBeenCalledWith('11');
        });

        it('transforms parameters into a nice dictionary', function () {
            var mock0, mock1, mock2, router;

            mock0 = createSpy('mock0');
            mock1 = createSpy('mock1');
            mock2 = createSpy('mock2');


            router = createRouter([
                ['/post/:id'           , mock0],
                ['/post/:id/page-:page', mock1],
                ['/post/:id-test'      , mock2]
            ]);

            router('/post/42?foo=bar');
            expect(mock0).toHaveBeenCalledWith('42', { foo: 'bar' });

            router('/post/42/page-1?foo=bar&baz=1');
            expect(mock1).toHaveBeenCalledWith('42', '1', { foo: 'bar' });

            router('/post/42/page-1?foo=bar');
            expect(mock1).toHaveBeenCalledWith('42', '1', { foo: 'bar' });
        });

    });


}) (
    // JasmineJS stuff
    window.describe,
    window.it,
    window.expect,
    window.jasmine.createSpy,

    // Domain specific stuff
    window.morgen.createRouter
);

