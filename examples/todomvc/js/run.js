(function (run, load) {
	'use strict';

    run({ watch: true });

    load('init_db');
    load('list', '#todoapp');

})(
    window.morgen.run,
    window.morgen.load
);
