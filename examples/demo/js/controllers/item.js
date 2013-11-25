(function (morgen) {

	'use strict';

    morgen.register('item', function (c) {

        c.events = {
            'click img': function (e) {
                window.app.votes[c.extras.id]++;
                morgen.broadcast({ type: 'votes', data: window.app.votes });
            }
        };

        c.render('item', c.extras);

    });

})(window.morgen);
