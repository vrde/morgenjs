(function (load, run) {

    load('init_db');
    load('app');

    window.myapp = window.myapp || {};

    run({ watch: true });

}) (window.morgen.load,
    window.morgen.run);

