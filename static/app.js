(function (load) {
    var main, header, list;

    main   = load('main', '[data-scope="main"]');
    header = load('header', main.$('[data-scope="header"]'), { name: 'Mario Brega' });
    list   = load('list', main.$('[data-scope="content"]'));

}) (window.morgen.load);

