(function (load, dispatch) {

    'use strict';


    // Load the watchdog controller, and start watching
    // the FS change! :)
    load('__morgen_watchdog');


    // Load the history controller
    load('__morgen_history');


    // Bootstrap the main app
    dispatch('bootstrap');

}) (window.morgen.load,
    window.morgen.dispatch);

