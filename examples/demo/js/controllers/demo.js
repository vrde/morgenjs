(function (morgen) {

	'use strict';

    morgen.register('demo', function (c) {
        var i = 0,
            meme, itemCtrl;

        c.render('demo');

        while (meme = window.app.memes[i++]) {
            itemCtrl = morgen.create('item', meme);
            c.$().appendChild(itemCtrl.element);
        }

    });

})(window.morgen);
