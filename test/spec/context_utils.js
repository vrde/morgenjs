(function (describe, it, expect,
           register, create, registerTemplate) {

    'use strict';


    describe('Context utilities', function () {

        it('set and get elements matching [data-model]', function () {
            var controller, ctx;

            registerTemplate('t_cu_test', [
                '<div>',
                '    <span data-model="foo"></span>',
                '    <input data-model="foo" />',
                '</div>'].join(''));

            controller = register('cu_test', function (c) {
                c.render('t_cu_test');
                ctx = c;
            });

            create('cu_test');

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

