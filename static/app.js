(function (register, load, remove, hub) {

    register('app', function (c) {
        var main, header, list, details;

        c.routes = [
            ['/', function (id) {
                list.element.classList.remove('hide');
                details.element.classList.add('hide');
            }],

            ['/item/:id', function (id) {
                list.element.classList.add('hide');
                details.element.classList.remove('hide');
                details = load('itemdetails', main.$('[data-scope="itemdetails"]'), { id: id });
            }]];

        main    = load('main', '[data-scope="main"]');
        header  = load('header', main.$('[data-scope="header"]'), { name: 'Mario Brega' });
        list    = load('list', main.$('[data-scope="list"]'));
        details = load('itemdetails', main.$('[data-scope="itemdetails"]'), { id: '0' });

        c.ready();
    });

    load('app');

}) (window.morgen.register,
    window.morgen.load,
    window.morgen.remove,
    window.morgen.hub);

