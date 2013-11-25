(function (ns) {
	'use strict';

    ns.app = ns.app || {};

    ns.app.votes = [0, 0, 0];

    ns.app.memes = [
        { id: 0, src: '/demo/assets/grumpy_256.jpg', name: 'Grumpy Cat' },
        { id: 1, src: '/demo/assets/doge_256.jpg',   name: 'Doge' },
        { id: 2, src: '/demo/assets/dawson_256.jpg', name: 'Dawson' },
    ];

}) (window);
