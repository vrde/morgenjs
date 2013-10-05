(function (ns) {
    // Define global objects

    'use strict';

    // Internal data structure, manipulated only by the public
    // functions exposed by the `morgen` namespace.
    ns.__morgen = {

        // contains all the contexts in the current session
        contexts   : { },

        // contains all the controllers registered
        controllers: { },

        // an int to generate uids
        uid        : 0
    };


    // Main namespace, contains all the public functions
    // to manipulate all the things.
    ns.morgen = { };

}) (this);

