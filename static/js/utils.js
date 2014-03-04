(function (load, morgen, __morgen) {
    'use strict';

    morgen.uid = function () {
        return __morgen.uid++;
    };

    morgen.run = function (options) {
        load('__morgen_broadcast');
        load('__morgen_history');
        load('__morgen_data_events');

        if (options.watch)
            load('__morgen_watchdog');
    };

    morgen.broadcast = function (msg) {
        __morgen.ws.send(JSON.stringify(msg));
    };

}) (window.morgen.load,
    window.morgen,
    window.__morgen);

