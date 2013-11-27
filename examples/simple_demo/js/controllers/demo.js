(function (morgen) {

	'use strict';

    morgen.register('demo', function (c) {

        var todo = ['eat a schnitzel',
                    'say goodbye to Berlusconi',
                    'buy some bitcoins',
                    'learn German',
                    'finish this demo'],
            i, itemCtrl;

        c.render('demo');

        for (i = 0; i < todo.length; i++) {
            itemCtrl = morgen.create('item', { item: todo[i] });
            c.$('ul').appendChild(itemCtrl.element);
        }

    });

})(window.morgen);
