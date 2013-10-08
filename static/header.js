(function (register) {

    register('header', function (c) {
        c.render('header', { name: c.extras.name.toUpperCase() });
    });

}) (window.morgen.register);

