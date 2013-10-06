(function (register, load, hub) {

    register('app', function (c) {

        var route = function (e) {
            var href = e.detail.href;
        };


        c.events = {
            '_scope': hub,

            'bootstrap': function (e) {
                var main, header, list;

                main   = load('main', '[data-scope="main"]');
                header = load('header', main.$('[data-scope="header"]'), { name: 'Mario Brega' });
                list   = load('list', main.$('[data-scope="content"]'));
            },

            'route': route
        };

    });


    load('app');

}) (window.morgen.register,
    window.morgen.load,
    window.morgen.hub);

