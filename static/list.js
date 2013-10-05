(function (register) {

    register('list', function (c) {

        c.events = {
            'click a': function (e) { console.log('ciao'); }
        };

        c.render('list', { name: 'Foo' });

    });


}) (window.morgen.register);

