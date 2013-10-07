(function (register) {

    register('header', function (c) {
        c.render('header', { name: c.extras.name.toUpperCase() });
        c.ready();
    });

}) (window.morgen.register);

