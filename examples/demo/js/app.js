(function (ns, morgen) {
	'use strict';

    ns.app = ns.app || {};

    ns.app.votes = [0, 0, 0];

    ns.app.memes = [
        { id: 0, src: '/demo/assets/grumpy_256.jpg', name: 'Grumpy Cat' },
        { id: 1, src: '/demo/assets/doge_256.jpg',   name: 'Doge' },
        { id: 2, src: '/demo/assets/dawson_256.jpg', name: 'Dawson' }
    ];


    ns.app.castVote = function (id) {
        morgen.broadcast({
            type  :'vote',
            target: id,
            last  : window.app.votes
        });

        window.app.votes[id]++;
        morgen.dispatch('votesUpdate');
    };

    ns.app.updateVotes = function (vote) {
        console.log('hello');
        for (var i = 0; i < vote.last.length; i++) {
            ns.app.votes[i] = Math.max(ns.app.votes[i], vote.last[i]);
        }
        ns.app.votes[vote.target]++;
        morgen.dispatch('votesUpdate');
    };

}) (window, window.morgen);
