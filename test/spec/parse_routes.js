(function (describe, it, expect, createSpy, createRouter) {

    'use strict';


    describe('Route parser', function () {


        it('creates a valid route object from an empty list of routes', function () {
            var router;
            router = createRouter([]);
            expect(router.route).toBeTruthy();
        });


        it('creates a route object able to manage static paths', function () {
            var mock0, mock1, mock2, mock3, router;
            
            mock0 = createSpy('mock0');
            mock1 = createSpy('mock1');
            mock2 = createSpy('mock2');
            mock3 = createSpy('mock3');


            router = createRouter([
                [''               , mock0],
                ['resources'      , mock1],
                ['resources/about', mock2],
                ['resources/terms', mock3]
            ]);

            router.route('');
            expect(mock0).toHaveBeenCalled();

            router.route('resources');
            expect(mock1).toHaveBeenCalled();

            router.route('resources/about');
            expect(mock2).toHaveBeenCalled();

            router.route('resources/terms_');
            expect(mock3).not.toHaveBeenCalled();
        });


        it('creates a route object able to manage arguments', function () {
            var mock0, mock1, mock2, router;
            
            mock0 = createSpy('mock0');
            mock1 = createSpy('mock1');
            mock2 = createSpy('mock2');


            router = createRouter([
                ['post/:id'           , mock0],
                ['post/:id/page-:page', mock1],
                ['post/:id-test'      , mock2]
            ]);

            router.route('post/42');
            expect(mock0).toHaveBeenCalledWith('42');

            router.route('post/42/page-3');
            expect(mock1).toHaveBeenCalledWith('42', '3');

            router.route('post/11-test');
            expect(mock2).toHaveBeenCalledWith('11');
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

