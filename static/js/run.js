(function (load, dispatch) {

    'use strict';


    // Load the watchdog controller, and start watching
    // the FS change! :)
    load('__morgen_watchdog');

    load('__morgen_broadcast');

    // Load the history controller
    load('__morgen_history');

}) (window.morgen.load,
    window.morgen.dispatch);

