(function (morgen) {

	'use strict';

    morgen.register('demo', function (c) {

        var todo = [
                { label: 'eat a schnitzel', done: false },
                { label: 'say goodbye to Berlusconi', done: false },
                { label: 'buy some bitcoins', done: false },
                { label: 'learn German', done: false },
                { label: 'finish this demo', done: false }
            ],


            i, itemCtrl;

        c.render('demo');

        for (i = 0; i < todo.length; i++) {
            itemCtrl = morgen.create('item', todo[i]);
            c.$('ul').appendChild(itemCtrl.element);
        }

    });

})(window.morgen);
