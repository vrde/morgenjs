(function (morgen) {

	'use strict';

    morgen.register('demo', function (c) {
        var i = 0,
            meme, itemCtrl;

        c.events = {
            'vote': function (e) {
                window.app.updateVotes(e.detail);
            }
        };

        c.render('demo');

        while (meme = window.app.memes[i++]) {
            itemCtrl = morgen.create('item', meme);
            c.$('ul').appendChild(itemCtrl.element);
        }

    });

})(window.morgen);
