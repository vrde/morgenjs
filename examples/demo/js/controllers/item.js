(function (app, morgen) {

	'use strict';

    morgen.register('item', function (c) {

        c.events = {
            'click img,touchstart img': function (e) {
                app.castVote(c.extras.id);
            },

            'votesUpdate': function () {
                c.set('votes', app.votes[c.extras.id]);
            },
        };
        c.extras.votes = app.votes[c.extras.id];
        c.render('item', c.extras);
    });

})(window.app, window.morgen);
