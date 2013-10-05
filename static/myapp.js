(function (register) {

    register('main', function (c) {

        c.events = {
            'click a': function (e) { console.log('ciao'); }
        };

        c.render('main', { name: c.extras.name.toLowerCase() });

    });


}) (window.morgen.register);

