(function (register) {

    var controller = function (c) {
        c.events = {
            'click a': function (e) { console.log('ciao'); }
        };

        c.render('main', { name: c.extras.name.toLowerCase() });
    };

    register(controller, 'main');

}) (window.morgen.register);

