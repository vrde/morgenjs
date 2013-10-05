(function (register) {

    var controller = function (c) {
        c.events = {
            'click a': function (e) { console.log('ciao'); }
        };

        c.render('list', { name: 'Foo' });
    };

    register(controller, 'list');

}) (window.morgen.register);

