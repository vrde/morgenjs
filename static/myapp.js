(function (bind) {

    var controller = function (c) {
        c.events = {
            'click a': function (e) { console.log('ciao'); }
        };

        c.render('cat');
    };

    bind(controller, '[data-app]');

}) (window.bind);

