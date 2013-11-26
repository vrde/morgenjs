(function (app, morgen) {

	'use strict';

    morgen.register('item', function (c) {

        c.events = {
            'click .wrapper': function (e) {
                app.castVote(c.extras.id);
                c.set('votes', function (v) { return parseInt(v) + 1; });

                c.$().addClass('do--push');
                window.setTimeout(function () { c.$().removeClass('do--push'); }, 300);
                //alert('thank you for voting for ' + c.extras.name);
            },

            'votesUpdate': function () {
                var prev = c.set('votes', app.votes[c.extras.id]);

                // do some fancy animation
                if (prev != app.votes[c.extras.id]) {
                    c.$().addClass('do--update');
                    window.setTimeout(function () { c.$().removeClass('do--update'); }, 300);
                }
            },
        };
        c.extras.votes = app.votes[c.extras.id];
        c.render('item', c.extras);
    });

})(window.app, window.morgen);
