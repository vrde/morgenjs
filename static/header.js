(function (register) {

    register('header', function (c) {
        c.render('header', { name: c.extras.name.toUpperCase() });

        c.routes = [
            ['/', function () { c.set('page', 'root'); }],

            ['/item/:id', function (id) { c.set('page', 'item ' + id); }]
        ];

    });

}) (window.morgen.register);

