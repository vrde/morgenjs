(function (morgen, __morgen) {
    'use strict';

    morgen.db = function () {
        return __morgen.uid++;
    };


}) (window.morgen,
    window.__morgen);

