(function (describe, it, expect,
           register, create, registerTemplate) {

    'use strict';


    describe('Context utilities', function () {

        it('set and get elements matching [data-model]', function () {
            var controller, c;

            registerTemplate('t_cu_test', [
                '<div>',
                '    <span data-model="foo">123</span>',
                '    <input data-model="foo" value="123" />',
                '    <input data-model="bar" value="abc" />',
                '    <textarea data-model="baz">stella</textarea>',
                '</div>'].join(''));

            controller = register('cu_test', function (c) {
                c.render('t_cu_test');
            });

            c = create('cu_test');

            expect(c.get('foo')).toBe('123');
            expect(c.get('bar')).toBe('abc');
            expect(c.get('baz')).toBe('stella');

            c.set('foo', 42);
            expect(c.get('foo')).toBe('42');
            expect(c.$('span').textContent).toBe('42');
            expect(c.$('input')[0].value).toBe('42');

            c.set('bar', 101);
            expect(c.get('bar')).toBe('101');
            expect(c.$('input')[1].value).toBe('101');

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

