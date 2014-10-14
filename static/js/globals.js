(function (ns) {
    // Define global objects

    'use strict';

    // Internal data structure, manipulated only by the public
    // functions exposed by the `morgen` namespace.
    ns.__morgen = {

        // Global events are automatically added to every
        // controller. It's a cheap way to avoid binding
        // *live* events to the DOM.
        events: { },

        // contain all the contexts in the current session
        contexts: { },

        // contain all the controllers registered
        controllers: { },


        // store all the templates
        templates: { },

        // a map between templates and controllers
        tmpl2ctrl: { },


        // config dict for tweaking the main behaviour
        // can be manipulated using utils.config
        config: {
            http: {
                apiRoot: null,
                withCredentials: false,
                appendParams: {}
            }
        },


        // an int to generate uids
        uid: 0,

        // listeners counter
        totalListeners: 0

    };


    // Main namespace, contains all the public functions
    // to manipulate all the things.
    ns.morgen = { };

}) (this);

