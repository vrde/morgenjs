(function (morgen) {

	'use strict';

    morgen.register('item', function (c) {

        c.events = {
            'click button': function (e) {
                c.$().toggleClass('done');
                c.extras.done = !c.extras.done;
            }
        };

        c.render('item', c.extras);
        c.$().toggleClass('done', c.extras.done);

    });

})(window.morgen);
