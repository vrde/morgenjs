(function (morgen) {

	'use strict';

    morgen.register('item', function (c) {

        c.events = {
            'click button': function (e) {
                c.$().toggleClass('done');
            }
        };

        c.render('item', c.extras);

    });

})(window.morgen);
