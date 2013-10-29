(function (describe, it, expect,
           register, create, registerTemplate) {

    'use strict';


    describe('Proxy', function () {
        var controller, c;

        registerTemplate('t_pu_test', [
            '<div>',
            '    <span data-model="foo">123</span>',
            '    <span data-model="foooo">abc</span>',
            '    <input data-model="foo" value="123" />',
            '    <input data-model="bar" value="abc" />',
            '    <textarea data-model="baz">stella</textarea>',
            '</div>'].join(''));

        controller = register('pu_test', function (c) {
            c.render('t_pu_test');
        });

        c = create('pu_test');


        it('contains the array property correctly initialized', function () {
            expect(c.$('input').length).toBe(2);
        });


        it('iterates through nodes', function () {
            var counter = 0;

            c.$('span').each( function (elem) { counter++; } );

            expect(counter).toBe(2);
        });


        it('exposes classList api', function () {
            var spans = c.element.querySelectorAll('span'),
                span, i = 0;

            c.$('span').addClass('new-class');

            while (span = spans[i++])
                expect(span.classList.contains('new-class')).toBeTruthy();
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
    window.morgen.registerTemplate
);

