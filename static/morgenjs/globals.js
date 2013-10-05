(function (ns) {
    // Define global objects

    'use strict';

    ns.__morgen = {

        // contains all the contexts in the current session
        contexts   : { },

        // contains all the controllers registered
        controllers: { },

        // an int to generate uids
        uid        : 0
    };

    ns.morgen = { };

}) (this);

