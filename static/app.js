(function (register, load, hub) {

    register('app', function (c) {
        var main, header, list;

        c.routes = [
            [ '/item/:name', function (name) { console.log('>>>', name); } ]
        ];

        main   = load('main', '[data-scope="main"]');
        header = load('header', main.$('[data-scope="header"]'), { name: 'Mario Brega' });
        list   = load('list', main.$('[data-scope="content"]'));
    });

    load('app');

}) (window.morgen.register,
    window.morgen.load,
    window.morgen.hub);

