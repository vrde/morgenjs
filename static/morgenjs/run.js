(function (load) {

    'use strict';


    // Load the watchdog controller, and start watching
    // the FS change! :)
    load('__morgen_watchdog');


    // Load the history controller
    load('__morgen_history');

}) (window.morgen.load);

